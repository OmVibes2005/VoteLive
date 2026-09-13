import {
    useEffect,
    useState,
    useRef
} from "react";

import {
    useParams,
    useNavigate
} from "react-router-dom";

import api from "../services/api";

import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client/dist/sockjs.js";

import "./ShowPage.css";


function ShowPage() {

    const { showId } = useParams();

    const navigate = useNavigate();


    /* =========================================
       STATE
    ========================================= */

    const [show, setShow] = useState(null);

    const [contestants, setContestants] =
        useState([]);

    const [myVote, setMyVote] =
        useState(null);

    const [voteResults, setVoteResults] =
        useState([]);

    const [totalVotes, setTotalVotes] =
        useState(0);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [voteMessage, setVoteMessage] =
        useState("");

    const [votingContestant, setVotingContestant] =
        useState(null);


    const stompClientRef =
        useRef(null);


    /* =========================================
       FETCH SHOW DATA
    ========================================= */

    useEffect(() => {

        const fetchShowData = async () => {

            try {

                setLoading(true);
                setError("");

                const showResponse =
                    await api.get(
                        "/shows/" + showId
                    );

                const contestantsResponse =
                    await api.get(
                        "/contestants/show/" + showId
                    );

                const myVoteResponse =
                    await api.get(
                        "/votes/my-vote/" + showId
                    );

                const resultsResponse =
                    await api.get(
                        "/votes/results/show/" + showId
                    );


                setShow(
                    showResponse.data
                );

                setContestants(
                    contestantsResponse.data
                );

                setMyVote(
                    myVoteResponse.data
                );

                setVoteResults(
                    resultsResponse.data
                );


                const total =
                    resultsResponse.data.reduce(
                        (sum, result) =>
                            sum + result.voteCount,
                        0
                    );

                setTotalVotes(total);


            } catch (error) {

                setError(
                    error.response?.data?.error ||
                    "Unable to load show information."
                );

            } finally {

                setLoading(false);
            }
        };


        fetchShowData();


        /* =====================================
           WEBSOCKET
        ===================================== */

        const client = new Client({

            webSocketFactory: () =>
                new SockJS(
                    "http://localhost:8080/ws"
                ),

            reconnectDelay: 5000,


            onConnect: () => {

                console.log(
                    "WebSocket connected"
                );


                client.subscribe(
                    "/topic/show/" +
                    showId +
                    "/results",

                    (message) => {

                        const updatedResults =
                            JSON.parse(
                                message.body
                            );


                        setVoteResults(
                            updatedResults
                        );


                        const total =
                            updatedResults.reduce(
                                (sum, result) =>
                                    sum +
                                    result.voteCount,
                                0
                            );

                        setTotalVotes(total);
                    }
                );

            },


            onStompError: (frame) => {

                console.error(
                    "WebSocket error:",
                    frame
                );

            }

        });


        client.activate();

        stompClientRef.current = client;


        return () => {

            if (stompClientRef.current) {

                stompClientRef.current.deactivate();

                stompClientRef.current = null;
            }

        };

    }, [showId]);


    /* =========================================
       HANDLE VOTE
    ========================================= */

    const handleVote = async (
        contestantId
    ) => {

        if (myVote?.hasVoted) {

            setVoteMessage(
                `You have already voted for ${myVote.contestantName}.`
            );

            return;
        }


        if (!show?.votingActive) {

            setError(
                "Voting is currently closed."
            );

            return;
        }


        setError("");
        setVoteMessage("");

        setVotingContestant(
            contestantId
        );


        try {

            const response =
                await api.post(
                    "/votes",
                    {
                        showId:
                            Number(showId),

                        contestantId:
                        contestantId
                    }
                );


            const votedContestant =
                contestants.find(
                    (contestant) =>
                        contestant.id ===
                        contestantId
                );


            setMyVote({

                hasVoted: true,

                showId:
                    Number(showId),

                contestantId:
                contestantId,

                contestantName:
                votedContestant?.name,

                votedAt:
                response.data.votedAt

            });


            setVoteMessage(
                `Your vote for ${votedContestant?.name} has been submitted successfully.`
            );


            const resultsResponse =
                await api.get(
                    "/votes/results/show/" +
                    showId
                );


            setVoteResults(
                resultsResponse.data
            );


            const total =
                resultsResponse.data.reduce(
                    (sum, result) =>
                        sum + result.voteCount,
                    0
                );

            setTotalVotes(total);


        } catch (error) {

            setError(
                error.response?.data?.error ||
                "Unable to cast vote."
            );

        } finally {

            setVotingContestant(
                null
            );
        }
    };


    /* =========================================
       LOADING
    ========================================= */

    if (loading) {

        return (

            <div className="show-page loading-page">

                <div className="loading-card">

                    <div className="spinner"></div>

                    <h3>
                        Loading show
                    </h3>

                    <p>
                        Preparing the voting experience...
                    </p>

                </div>

            </div>
        );
    }


    /* =========================================
       ERROR
    ========================================= */

    if (error && !show) {

        return (

            <div className="show-page">

                <div className="error-card">

                    <div className="show-error-icon">
                        !
                    </div>

                    <h2>
                        Unable to Load Show
                    </h2>

                    <p>
                        {error}
                    </p>

                    <button
                        onClick={() =>
                            navigate("/dashboard")
                        }
                    >
                        ← Back to Dashboard
                    </button>

                </div>

            </div>
        );
    }


    /* =========================================
       MAIN PAGE
    ========================================= */

    return (

        <div className="show-page">


            {/* =====================================
                HEADER
            ===================================== */}

            <header className="show-header">

                <div className="show-header-inner">


                    {/* BRAND */}

                    <button
                        className="show-brand"
                        onClick={() =>
                            navigate("/dashboard")
                        }
                    >

                        <span className="show-brand-icon">
                            🗳️
                        </span>

                        <span className="show-brand-text">
                            VoteLive
                        </span>

                    </button>


                    {/* BACK */}

                    <button
                        className="show-back-button"
                        onClick={() =>
                            navigate("/dashboard")
                        }
                    >
                        ← Dashboard
                    </button>

                </div>

            </header>


            {/* =====================================
                SHOW HERO
            ===================================== */}

            <section className="show-hero">

                <div className="show-hero-content">

                    <div className="show-hero-meta">

                        <span className="show-category">
                            REALITY SHOW
                        </span>

                        <span
                            className={
                                show.votingActive
                                    ? "voting-status active"
                                    : "voting-status closed"
                            }
                        >

                            <span className="status-dot"></span>

                            {show.votingActive
                                ? "Voting Active"
                                : "Voting Closed"}

                        </span>

                    </div>


                    <h1>
                        {show.title}
                    </h1>


                    <p className="show-description">
                        {show.description}
                    </p>


                    <div className="show-stats">

                        <div className="show-stat">

                            <span className="show-stat-icon">
                                👥
                            </span>

                            <div>

                                <strong>
                                    {contestants.length}
                                </strong>

                                <span>
                                    Contestants
                                </span>

                            </div>

                        </div>


                        <div className="show-stat">

                            <span className="show-stat-icon">
                                🗳️
                            </span>

                            <div>

                                <strong>
                                    {totalVotes}
                                </strong>

                                <span>
                                    Total Votes
                                </span>

                            </div>

                        </div>


                        <div className="show-stat">

                            <span className="show-stat-icon">
                                {show.votingActive
                                    ? "🟢"
                                    : "🔴"}
                            </span>

                            <div>

                                <strong>
                                    {show.votingActive
                                        ? "LIVE"
                                        : "CLOSED"}
                                </strong>

                                <span>
                                    Voting Status
                                </span>

                            </div>

                        </div>

                    </div>

                </div>


                <div className="show-hero-visual">

                    <div className="hero-vote-icon">
                        🗳️
                    </div>

                    <span>
                        Your vote matters
                    </span>

                </div>

            </section>


            {/* =====================================
                VOTE STATUS
            ===================================== */}

            {myVote?.hasVoted && (

                <div className="vote-banner">

                    <span className="banner-icon">
                        ✓
                    </span>

                    <div>

                        <strong>
                            Vote Submitted Successfully
                        </strong>

                        <p>
                            You voted for{" "}
                            <strong>
                                {myVote.contestantName}
                            </strong>.
                        </p>

                        <small>
                            You can vote only once in this show.
                        </small>

                    </div>

                </div>

            )}


            {/* =====================================
                SUCCESS MESSAGE
            ===================================== */}

            {voteMessage && (

                <div className="message success-message">

                    ✓ {voteMessage}

                </div>

            )}


            {/* =====================================
                ERROR MESSAGE
            ===================================== */}

            {error && (

                <div className="message error-message">

                    ⚠ {error}

                </div>

            )}


            {/* =====================================
                MAIN CONTENT
            ===================================== */}

            <main className="show-content">


                {/* =================================
                    CONTESTANTS
                ================================= */}

                <section className="contestants-section">

                    <div className="section-heading">

                        <div>

                            <span className="section-eyebrow">
                                CAST YOUR VOTE
                            </span>

                            <h2>
                                Choose Your Favorite
                            </h2>

                            <p>

                                {myVote?.hasVoted
                                    ? "Your vote has been recorded for this show."
                                    : show.votingActive
                                        ? "Select one contestant to cast your vote."
                                        : "Voting is currently closed for this show."}

                            </p>

                        </div>


                        <span className="contestant-count">

                            {contestants.length}{" "}

                            {contestants.length === 1
                                ? "Contestant"
                                : "Contestants"}

                        </span>

                    </div>


                    {contestants.length === 0 ? (

                        <div className="empty-state">

                            <div className="empty-icon">
                                👥
                            </div>

                            <h3>
                                No Contestants Yet
                            </h3>

                            <p>
                                Contestants will appear here when
                                they are added to the show.
                            </p>

                        </div>

                    ) : (

                        <div className="contestant-grid">

                            {contestants.map(
                                (contestant) => {

                                    const isMyVote =
                                        myVote?.hasVoted &&
                                        myVote.contestantId ===
                                        contestant.id;


                                    return (

                                        <article
                                            className={
                                                isMyVote
                                                    ? "contestant-card selected"
                                                    : "contestant-card"
                                            }
                                            key={
                                                contestant.id
                                            }
                                        >


                                            {/* IMAGE */}

                                            <div className="contestant-image">

                                                {contestant.imageUrl ? (

                                                    <img
                                                        src={
                                                            contestant.imageUrl
                                                        }
                                                        alt={
                                                            contestant.name
                                                        }

                                                        onError={(
                                                            event
                                                        ) => {

                                                            event.currentTarget.style.display =
                                                                "none";

                                                            event.currentTarget.nextElementSibling.style.display =
                                                                "flex";

                                                        }}
                                                    />

                                                ) : null}


                                                <div
                                                    className="image-placeholder"
                                                    style={{
                                                        display:
                                                            contestant.imageUrl
                                                                ? "none"
                                                                : "flex"
                                                    }}
                                                >

                                                    {contestant.name
                                                        ?.charAt(0)
                                                        .toUpperCase()}

                                                </div>


                                                {isMyVote && (

                                                    <div className="selected-badge">

                                                        ✓ Your Vote

                                                    </div>

                                                )}

                                            </div>


                                            {/* CONTENT */}

                                            <div className="contestant-content">

                                                <div>

                                                    <span className="contestant-label">
                                                        CONTESTANT
                                                    </span>

                                                    <h3>
                                                        {contestant.name}
                                                    </h3>

                                                </div>


                                                <p>
                                                    {contestant.description ||
                                                        "No description available."}
                                                </p>


                                                {/* BUTTON */}

                                                {myVote?.hasVoted ? (

                                                    <button
                                                        className={
                                                            isMyVote
                                                                ? "vote-button selected-button"
                                                                : "vote-button disabled-button"
                                                        }

                                                        disabled
                                                    >

                                                        {isMyVote
                                                            ? "✓ Your Vote"
                                                            : "Already Voted"}

                                                    </button>

                                                ) : (

                                                    <button
                                                        className="vote-button"

                                                        onClick={() =>
                                                            handleVote(
                                                                contestant.id
                                                            )
                                                        }

                                                        disabled={
                                                            votingContestant ===
                                                            contestant.id ||
                                                            !show.votingActive
                                                        }
                                                    >

                                                        {votingContestant ===
                                                        contestant.id

                                                            ? (
                                                                <>
                                                                    <span className="button-spinner"></span>
                                                                    Voting...
                                                                </>
                                                            )

                                                            : show.votingActive
                                                                ? (
                                                                    <>
                                                                        Vote for{" "}
                                                                        {contestant.name}

                                                                        <span>
                                                                            →
                                                                        </span>
                                                                    </>
                                                                )

                                                                : "Voting Closed"}

                                                    </button>

                                                )}

                                            </div>

                                        </article>

                                    );

                                }
                            )}

                        </div>

                    )}

                </section>


                {/* =================================
                    LIVE RESULTS
                ================================= */}

                <section className="results-section">

                    <div className="section-heading">

                        <div>

                            <span className="section-eyebrow">
                                REAL-TIME UPDATES
                            </span>

                            <h2>
                                📊 Live Results
                            </h2>

                            <p>
                                Results update automatically as votes are submitted.
                            </p>

                        </div>


                        <div className="live-results-badge">

                            <span className="live-dot"></span>

                            LIVE

                        </div>

                    </div>


                    <div className="results-card">

                        <div className="results-summary">

                            <span>
                                Total votes
                            </span>

                            <strong>
                                {totalVotes}
                            </strong>

                        </div>


                        {voteResults.length === 0 ? (

                            <div className="empty-state results-empty">

                                <div className="empty-icon">
                                    📊
                                </div>

                                <h3>
                                    No Votes Yet
                                </h3>

                                <p>
                                    Results will appear here once votes
                                    are submitted.
                                </p>

                            </div>

                        ) : (

                            <div className="results-list">

                                {voteResults.map(
                                    (result) => (

                                        <div
                                            className={
                                                result.leading
                                                    ? "result-row leading"
                                                    : "result-row"
                                            }

                                            key={
                                                result.contestantId
                                            }
                                        >


                                            <div className="result-info">

                                                <div className="result-name">

                                                    <span className="rank">
                                                        #{result.rank}
                                                    </span>

                                                    <strong>
                                                        {result.contestantName}
                                                    </strong>

                                                    {result.leading && (

                                                        <span className="leader-badge">
                                                            Leading
                                                        </span>

                                                    )}

                                                </div>


                                                <span className="result-percentage">
                                                    {result.votePercentage}%
                                                </span>

                                            </div>


                                            <div className="progress-track">

                                                <div
                                                    className="progress-bar"

                                                    style={{
                                                        width:
                                                            result.votePercentage +
                                                            "%"
                                                    }}
                                                ></div>

                                            </div>


                                            <div className="vote-count">

                                                <strong>
                                                    {result.voteCount}
                                                </strong>

                                                {result.voteCount === 1
                                                    ? " vote"
                                                    : " votes"}

                                            </div>

                                        </div>

                                    )
                                )}

                            </div>

                        )}

                    </div>

                </section>

            </main>

        </div>
    );
}


export default ShowPage;