import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import LogoutButton from "../components/LogoutButton";
import "./UserDashboard.css";

function UserDashboard() {

    const navigate = useNavigate();

    const [shows, setShows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const userName =
        localStorage.getItem("name") || "User";


    /* =========================================
       FETCH SHOWS
    ========================================= */

    useEffect(() => {

        const fetchShows = async () => {

            try {

                setLoading(true);
                setError("");

                const response =
                    await api.get("/shows");

                setShows(response.data);

            } catch (error) {

                setError(
                    error.response?.data?.error ||
                    "Unable to load shows."
                );

            } finally {

                setLoading(false);
            }
        };

        fetchShows();

    }, []);


    /* =========================================
       LOADING
    ========================================= */

    if (loading) {

        return (
            <div className="dashboard-page">

                <header className="dashboard-header">

                    <div className="dashboard-brand">

                        <div className="dashboard-brand-icon">
                            🗳️
                        </div>

                        <div>

                            <h1>
                                VoteLive
                            </h1>

                            <p>
                                Real-Time Voting
                            </p>

                        </div>

                    </div>

                    <LogoutButton />

                </header>

                <main className="dashboard-content">

                    <div className="dashboard-loading">

                        <div className="dashboard-spinner"></div>

                        <h3>
                            Loading shows
                        </h3>

                        <p>
                            Please wait while we fetch the latest shows.
                        </p>

                    </div>

                </main>

            </div>
        );
    }


    /* =========================================
       ERROR
    ========================================= */

    if (error) {

        return (
            <div className="dashboard-page">

                <header className="dashboard-header">

                    <div className="dashboard-brand">

                        <div className="dashboard-brand-icon">
                            🗳️
                        </div>

                        <div>

                            <h1>
                                VoteLive
                            </h1>

                            <p>
                                Real-Time Voting
                            </p>

                        </div>

                    </div>

                    <LogoutButton />

                </header>

                <main className="dashboard-content">

                    <div className="dashboard-error">

                        <div className="dashboard-error-icon">
                            !
                        </div>

                        <h3>
                            Unable to load shows
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

                </main>

            </div>
        );
    }


    return (
        <div className="dashboard-page">

            {/* =================================
                HEADER
            ================================= */}

            <header className="dashboard-header">

                <div className="dashboard-brand">

                    <div className="dashboard-brand-icon">
                        🗳️
                    </div>

                    <div>

                        <h1>
                            VoteLive
                        </h1>

                        <p>
                            Real-Time Voting
                        </p>

                    </div>

                </div>

                <div className="dashboard-header-actions">

                    <button
                        className="dashboard-history-button"
                        onClick={() =>
                            navigate("/my-votes")
                        }
                    >
                        🗳️ My Votes
                    </button>

                    <LogoutButton />

                </div>

            </header>


            {/* =================================
                MAIN CONTENT
            ================================= */}

            <main className="dashboard-content">


                {/* =================================
                    HERO / WELCOME
                ================================= */}

                <section className="dashboard-hero">

                    <div className="dashboard-hero-content">

                        <span className="dashboard-eyebrow">
                            VOTELIVE DASHBOARD
                        </span>

                        <h2>
                            Welcome back, {userName} 👋
                        </h2>

                        <p>
                            Choose a show, select your favorite
                            contestant, and cast your vote.
                        </p>

                    </div>

                    <div className="dashboard-hero-icon">
                        🗳️
                    </div>

                </section>


                {/* =================================
                    SHOW SECTION HEADER
                ================================= */}

                <section className="shows-section">

                    <div className="shows-section-header">

                        <div>

                            <h2>
                                Available Shows
                            </h2>

                            <p>
                                Select a show to view contestants
                                and voting results.
                            </p>

                        </div>

                        <span className="show-count">
                            {shows.length}{" "}
                            {shows.length === 1
                                ? "Show"
                                : "Shows"}
                        </span>

                    </div>


                    {/* =================================
                        NO SHOWS
                    ================================= */}

                    {shows.length === 0 ? (

                        <div className="empty-shows">

                            <div className="empty-shows-icon">
                                🎬
                            </div>

                            <h3>
                                No Shows Available
                            </h3>

                            <p>
                                There are currently no reality
                                shows available for voting.
                                Please check again later.
                            </p>

                        </div>

                    ) : (

                        /* =================================
                           SHOW GRID
                        ================================= */

                        <div className="show-grid">

                            {shows.map((show) => (

                                <article
                                    className="show-card"
                                    key={show.id}
                                >

                                    {/* STATUS */}

                                    <div className="show-card-top">

                                        {show.votingActive ? (

                                            <span className="show-status active-status">
                                                <span className="status-dot"></span>
                                                Voting Active
                                            </span>

                                        ) : (

                                            <span className="show-status closed-status">
                                                <span className="status-dot"></span>
                                                Voting Closed
                                            </span>

                                        )}

                                    </div>


                                    {/* SHOW ICON */}

                                    <div className="show-card-icon">
                                        🎬
                                    </div>


                                    {/* SHOW INFORMATION */}

                                    <div className="show-card-content">

                                        <h3>
                                            {show.title}
                                        </h3>

                                        <p>
                                            {show.description ||
                                                "Vote for your favorite contestant."}
                                        </p>

                                    </div>


                                    {/* ACTION */}

                                    <button
                                        className={
                                            show.votingActive
                                                ? "show-card-button"
                                                : "show-card-button closed"
                                        }
                                        onClick={() =>
                                            navigate(
                                                `/show/${show.id}`
                                            )
                                        }
                                    >

                                        {show.votingActive
                                            ? "Vote Now"
                                            : "View Show"}

                                        <span>
                                            →
                                        </span>

                                    </button>

                                </article>

                            ))}

                        </div>

                    )}

                </section>

            </main>

        </div>
    );
}

export default UserDashboard;