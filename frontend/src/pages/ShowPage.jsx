import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client/dist/sockjs.js";
import "./ShowPage.css";

function ShowPage() {

    const { showId } = useParams();

    const [show, setShow] = useState(null);
    const [contestants, setContestants] = useState([]);
    const [myVote, setMyVote] = useState(null);

    const [voteResults, setVoteResults] = useState([]);
    const [totalVotes, setTotalVotes] = useState(0);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [voteMessage, setVoteMessage] = useState("");
    const [votingContestant, setVotingContestant] = useState(null);
    const stompClientRef = useRef(null);

    useEffect(() => {

        const fetchShowData = async () => {

            try {

                const showResponse =
                    await api.get("/shows/" + showId);

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


                setShow(showResponse.data);
                setContestants(contestantsResponse.data);
                setMyVote(myVoteResponse.data);

                setVoteResults(resultsResponse.data);


                const total = resultsResponse.data.reduce(
                    (sum, result) => sum + result.voteCount,
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

        // Connect to WebSocket
        const client = new Client({
            webSocketFactory: () =>
                new SockJS("http://localhost:8080/ws"),

            reconnectDelay: 5000,

            onConnect: () => {

                console.log(
                    "WebSocket connected"
                );

                client.subscribe(
                    "/topic/show/" + showId + "/results",
                    (message) => {

                        const updatedResults =
                            JSON.parse(message.body);

                        setVoteResults(
                            updatedResults
                        );

                        const total =
                            updatedResults.reduce(
                                (sum, result) =>
                                    sum + result.voteCount,
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

        // Cleanup WebSocket connection when leaving the page
        return () => {
            if (stompClientRef.current) {
                stompClientRef.current.deactivate();
                stompClientRef.current = null;
            }
        };

    }, [showId]);


    const handleVote = async (contestantId) => {

        setError("");
        setVoteMessage("");
        setVotingContestant(contestantId);

        try {

            const response = await api.post("/votes", {
                showId: Number(showId),
                contestantId: contestantId
            });


            setVoteMessage(response.data.message);


            const votedContestant = contestants.find(
                (contestant) =>
                    contestant.id === contestantId
            );


            setMyVote({
                hasVoted: true,
                showId: Number(showId),
                contestantId: contestantId,
                contestantName: votedContestant?.name,
                votedAt: response.data.votedAt
            });


            // Refresh vote results
            const resultsResponse =
                await api.get(
                    "/votes/results/show/" + showId
                );


            setVoteResults(resultsResponse.data);


            const total = resultsResponse.data.reduce(
                (sum, result) => sum + result.voteCount,
                0
            );

            setTotalVotes(total);


        } catch (error) {

            setError(
                error.response?.data?.error ||
                "Unable to cast vote."
            );

        } finally {

            setVotingContestant(null);

        }
    };


    if (loading) {

        return (
            <div className="show-page loading-page">

                <div className="loading-card">

                    <div className="spinner"></div>

                    <p>Loading show...</p>

                </div>

            </div>
        );

    }


    if (error && !show) {

        return (
            <div className="show-page">

                <div className="error-card">

                    <h2>Unable to Load Show</h2>

                    <p>{error}</p>

                </div>

            </div>
        );

    }


    return (

        <div className="show-page">

            <header className="show-header">

                <div className="brand">

                    <span className="brand-icon">
                        V
                    </span>

                    <span>
                        VoteLive
                    </span>

                </div>


                <div className="show-info">

                    <h1>
                        {show.title}
                    </h1>

                    <p>
                        {show.description}
                    </p>


                    <div
                        className={
                            show.votingActive
                                ? "voting-status active"
                                : "voting-status closed"
                        }
                    >

                        <span className="status-dot"></span>

                        {show.votingActive
                            ? "Voting is Active"
                            : "Voting is Closed"
                        }

                    </div>

                </div>

            </header>


            {myVote?.hasVoted && (

                <div className="vote-banner">

                    <span className="banner-icon">
                        ✓
                    </span>

                    <div>

                        <strong>
                            Vote Submitted
                        </strong>

                        <p>
                            You voted for{" "}

                            <strong>
                                {myVote.contestantName}
                            </strong>
                        </p>

                    </div>

                </div>

            )}


            {voteMessage && (

                <div className="message success-message">

                    ✓ {voteMessage}

                </div>

            )}


            {error && (

                <div className="message error-message">

                    ⚠ {error}

                </div>

            )}


            <main className="contestants-section">


                <div className="section-heading">

                    <div>

                        <h2>
                            Choose Your Favorite
                        </h2>

                        <p>
                            Select one contestant to cast your vote.
                        </p>

                    </div>


                    <span className="contestant-count">

                        {contestants.length} Contestants

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
                            Contestants will appear here when they
                            are added to the show.
                        </p>

                    </div>

                ) : (

                    <div className="contestant-grid">

                        {contestants.map((contestant) => {

                            const isMyVote =
                                myVote?.hasVoted &&
                                myVote.contestantId === contestant.id;


                            return (

                                <div
                                    className={
                                        isMyVote
                                            ? "contestant-card selected"
                                            : "contestant-card"
                                    }
                                    key={contestant.id}
                                >


                                    <div className="contestant-image">

                                        {contestant.imageUrl ? (

                                            <img
                                                src={contestant.imageUrl}
                                                alt={contestant.name}
                                                onError={(event) => {
                                                    event.currentTarget.style.display = "none";
                                                    event.currentTarget.nextElementSibling.style.display = "flex";
                                                }}
                                            />

                                        ) : null}

                                        <div
                                            className="image-placeholder"
                                            style={{
                                                display: contestant.imageUrl ? "none" : "flex"
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


                                    <div className="contestant-content">

                                        <h3>
                                            {contestant.name}
                                        </h3>


                                        <p>
                                            {contestant.description ||
                                                "No description available."}
                                        </p>


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
                                                    ? "Voting..."
                                                    : "Vote for " +
                                                    contestant.name}

                                            </button>

                                        )}

                                    </div>

                                </div>

                            );

                        })}

                    </div>

                )}


                {/* LIVE RESULTS */}

                <section className="results-section">

                    <div className="section-heading">

                        <div>

                            <h2>
                                📊 Live Results
                            </h2>

                            <p>
                                Current voting results for this show.
                            </p>

                        </div>


                        <span className="contestant-count">

                            {totalVotes} Total Votes

                        </span>

                    </div>


                    <div className="results-card">

                        {voteResults.length === 0 ? (

                            <div className="empty-state">

                                <div className="empty-icon">
                                    📊
                                </div>

                                <h3>
                                    No Votes Yet
                                </h3>

                                <p>
                                    Results will appear here once voting begins.
                                </p>

                            </div>

                        ) : (

                            voteResults.map((result) => (

                                <div
                                    className="result-row"
                                    key={result.contestantId}
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

                                        {result.voteCount}{" "}

                                        {result.voteCount === 1
                                            ? "vote"
                                            : "votes"}

                                    </div>

                                </div>

                            ))

                        )}

                    </div>

                </section>


            </main>

        </div>
    );
}


export default ShowPage;
