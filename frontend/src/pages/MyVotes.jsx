import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import LogoutButton from "../components/LogoutButton";
import "./MyVotes.css";

function MyVotes() {

    const navigate = useNavigate();

    const [votes, setVotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const userName =
        localStorage.getItem("name") || "User";


    /* =========================================
       FETCH VOTE HISTORY
    ========================================= */

    useEffect(() => {

        const fetchMyVotes = async () => {

            try {

                setLoading(true);
                setError("");

                const response =
                    await api.get("/votes/my-votes");

                setVotes(response.data);

            } catch (error) {

                setError(
                    error.response?.data?.error ||
                    "Unable to load your vote history."
                );

            } finally {

                setLoading(false);
            }
        };

        fetchMyVotes();

    }, []);


    /* =========================================
       FORMAT DATE
    ========================================= */

    const formatDate = (date) => {

        if (!date) {
            return "Unknown date";
        }

        return new Date(date).toLocaleString(
            undefined,
            {
                dateStyle: "medium",
                timeStyle: "short"
            }
        );
    };


    /* =========================================
       MAIN UI
    ========================================= */

    return (

        <div className="my-votes-page">


            {/* =================================
                HEADER
            ================================= */}

            <header className="my-votes-header">

                <div className="my-votes-header-inner">


                    {/* BRAND */}

                    <button
                        className="my-votes-brand"
                        onClick={() =>
                            navigate("/dashboard")
                        }
                    >

                        <span className="my-votes-brand-icon">
                            🗳️
                        </span>

                        <div>

                            <h1>
                                VoteLive
                            </h1>

                            <p>
                                Real-Time Voting
                            </p>

                        </div>

                    </button>


                    {/* ACTIONS */}

                    <div className="my-votes-header-actions">

                        <button
                            className="my-votes-back-button"
                            onClick={() =>
                                navigate("/dashboard")
                            }
                        >
                            ← Dashboard
                        </button>

                        <LogoutButton />

                    </div>

                </div>

            </header>


            {/* =================================
                MAIN CONTENT
            ================================= */}

            <main className="my-votes-content">


                {/* =================================
                    PAGE INTRO
                ================================= */}

                <section className="my-votes-hero">

                    <div>

                        <span className="my-votes-eyebrow">
                            VOTELIVE ACCOUNT
                        </span>

                        <h2>
                            Your Voting History
                        </h2>

                        <p>
                            Welcome back,{" "}
                            <strong>
                                {userName}
                            </strong>.
                            Review all the votes you have
                            submitted across VoteLive shows.
                        </p>

                    </div>


                    <div className="my-votes-hero-icon">
                        🗳️
                    </div>

                </section>


                {/* =================================
                    SUMMARY
                ================================= */}

                {!loading &&
                    !error &&
                    votes.length > 0 && (

                        <section className="vote-summary">

                            <div className="summary-card">

                                <span className="summary-icon">
                                    🗳️
                                </span>

                                <div>

                                    <strong>
                                        {votes.length}
                                    </strong>

                                    <span>
                                        Total Votes
                                    </span>

                                </div>

                            </div>


                            <div className="summary-card">

                                <span className="summary-icon">
                                    🎬
                                </span>

                                <div>

                                    <strong>
                                        {
                                            new Set(
                                                votes.map(
                                                    (vote) =>
                                                        vote.showId
                                                )
                                            ).size
                                        }
                                    </strong>

                                    <span>
                                        Shows Voted In
                                    </span>

                                </div>

                            </div>


                            <div className="summary-card">

                                <span className="summary-icon">
                                    ✓
                                </span>

                                <div>

                                    <strong>
                                        Verified
                                    </strong>

                                    <span>
                                        Voting Status
                                    </span>

                                </div>

                            </div>

                        </section>

                    )}


                {/* =================================
                    LOADING
                ================================= */}

                {loading && (

                    <div className="my-votes-state">

                        <div className="my-votes-spinner"></div>

                        <h3>
                            Loading your votes
                        </h3>

                        <p>
                            Retrieving your voting history...
                        </p>

                    </div>

                )}


                {/* =================================
                    ERROR
                ================================= */}

                {!loading && error && (

                    <div className="my-votes-error">

                        <div className="my-votes-error-icon">
                            !
                        </div>

                        <h3>
                            Unable to load voting history
                        </h3>

                        <p>
                            {error}
                        </p>

                        <button
                            onClick={() =>
                                window.location.reload()
                            }
                        >
                            Try Again
                        </button>

                    </div>

                )}


                {/* =================================
                    EMPTY STATE
                ================================= */}

                {!loading &&
                    !error &&
                    votes.length === 0 && (

                        <div className="my-votes-empty">

                            <div className="empty-votes-icon">
                                🗳️
                            </div>

                            <span className="my-votes-eyebrow">
                                NO VOTES FOUND
                            </span>

                            <h3>
                                You haven't voted yet
                            </h3>

                            <p>
                                Explore the available shows,
                                choose your favorite contestant,
                                and cast your first vote.
                            </p>

                            <button
                                onClick={() =>
                                    navigate("/dashboard")
                                }
                            >
                                Browse Shows
                                <span>→</span>
                            </button>

                        </div>

                    )}


                {/* =================================
                    VOTE HISTORY
                ================================= */}

                {!loading &&
                    !error &&
                    votes.length > 0 && (

                        <section className="vote-history-section">


                            {/* SECTION HEADER */}

                            <div className="vote-history-heading">

                                <div>

                                    <span className="my-votes-eyebrow">
                                        ACTIVITY
                                    </span>

                                    <h3>
                                        Recent Votes
                                    </h3>

                                    <p>
                                        Your submitted votes,
                                        newest first.
                                    </p>

                                </div>

                                <span className="vote-history-count">

                                    {votes.length}{" "}

                                    {votes.length === 1
                                        ? "Vote"
                                        : "Votes"}

                                </span>

                            </div>


                            {/* HISTORY */}

                            <div className="vote-history-list">

                                {votes.map(
                                    (vote, index) => (

                                        <article
                                            className="vote-history-card"
                                            key={
                                                vote.voteId
                                            }
                                        >


                                            {/* NUMBER */}

                                            <div className="vote-number">

                                                <span>
                                                    #{index + 1}
                                                </span>

                                            </div>


                                            {/* MAIN */}

                                            <div className="vote-history-main">


                                                {/* SHOW */}

                                                <div className="vote-history-block">

                                                    <span className="vote-label">
                                                        SHOW
                                                    </span>

                                                    <h4>
                                                        {vote.showTitle}
                                                    </h4>

                                                </div>


                                                {/* VOTE */}

                                                <div className="vote-history-block">

                                                    <span className="vote-label">
                                                        YOUR VOTE
                                                    </span>

                                                    <div className="contestant-name">

                                                        <span className="contestant-icon">
                                                            👤
                                                        </span>

                                                        {vote.contestantName}

                                                    </div>

                                                </div>


                                                {/* DATE */}

                                                <div className="vote-history-block vote-date-block">

                                                    <span className="vote-label">
                                                        VOTED ON
                                                    </span>

                                                    <span className="vote-date">
                                                        {formatDate(
                                                            vote.votedAt
                                                        )}
                                                    </span>

                                                </div>

                                            </div>


                                            {/* ACTION */}

                                            <div className="vote-history-action">

                                                <button
                                                    onClick={() =>
                                                        navigate(
                                                            `/show/${vote.showId}`
                                                        )
                                                    }
                                                >
                                                    View Show
                                                    <span>→</span>
                                                </button>

                                            </div>

                                        </article>

                                    )
                                )}

                            </div>

                        </section>

                    )}

            </main>

        </div>
    );
}

export default MyVotes;