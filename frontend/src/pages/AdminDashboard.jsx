import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";
import LogoutButton from "../components/LogoutButton";

import "./AdminDashboard.css";


function AdminDashboard() {

    const navigate = useNavigate();


    /* =========================================
       STATE
    ========================================= */

    const [stats, setStats] = useState({
        totalShows: 0,
        activeShows: 0,
        totalContestants: 0,
        totalVotes: 0,
        totalUsers: 0,
        votesToday: 0
    });

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    const userRole =
        localStorage.getItem("role");


    /* =========================================
       FETCH STATISTICS
    ========================================= */

    useEffect(() => {

        if (userRole !== "ADMIN") {

            setLoading(false);

            return;
        }


        const fetchStats = async () => {

            try {

                setLoading(true);
                setError("");

                const response =
                    await api.get("/admin/stats");

                setStats(response.data);

            } catch (error) {

                setError(
                    error.response?.data?.error ||
                    "Unable to load dashboard statistics."
                );

            } finally {

                setLoading(false);
            }
        };


        fetchStats();

    }, [userRole]);


    /* =========================================
       ACCESS DENIED
    ========================================= */

    if (userRole !== "ADMIN") {

        return (

            <div className="admin-access-denied">

                <div className="access-denied-card">

                    <div className="access-denied-icon">
                        🔒
                    </div>

                    <span className="admin-eyebrow">
                        ADMINISTRATION
                    </span>

                    <h1>
                        Access Denied
                    </h1>

                    <p>
                        You do not have permission to access
                        the VoteLive administration dashboard.
                    </p>

                    <button
                        onClick={() =>
                            navigate("/")
                        }
                    >
                        ← Go Home
                    </button>

                </div>

            </div>

        );
    }


    return (

        <div className="admin-dashboard">


            {/* =====================================
                HEADER
            ===================================== */}

            <header className="admin-header">

                <div className="admin-header-inner">


                    {/* BRAND */}

                    <button
                        className="admin-brand"
                        onClick={() =>
                            navigate("/admin")
                        }
                    >

                        <span className="admin-brand-icon">
                            🗳️
                        </span>

                        <div>

                            <h1>
                                VoteLive Admin
                            </h1>

                            <p>
                                Administration Panel
                            </p>

                        </div>

                    </button>


                    {/* ACTIONS */}

                    <div className="admin-header-actions">

                        <button
                            className="admin-home-button"
                            onClick={() =>
                                navigate("/")
                            }
                        >
                            ← Home
                        </button>

                        <LogoutButton />

                    </div>

                </div>

            </header>


            {/* =====================================
                CONTENT
            ===================================== */}

            <main className="admin-content">


                {/* =================================
                    PAGE INTRO
                ================================= */}

                <section className="admin-welcome">

                    <div>

                        <span className="admin-eyebrow">
                            ADMINISTRATION
                        </span>

                        <h2>
                            Dashboard
                        </h2>

                        <p>
                            Monitor and manage the VoteLive
                            platform from one central location.
                        </p>

                    </div>


                    <div className="admin-welcome-icon">
                        ⚙️
                    </div>

                </section>


                {/* =================================
                    ERROR
                ================================= */}

                {error && (

                    <div className="admin-error">

                        <span className="admin-error-icon">
                            !
                        </span>

                        <div>

                            <strong>
                                Unable to load statistics
                            </strong>

                            <p>
                                {error}
                            </p>

                        </div>

                    </div>

                )}


                {/* =================================
                    STATISTICS
                ================================= */}

                <section className="stats-section">

                    <div className="admin-section-heading">

                        <div>

                            <span className="admin-eyebrow">
                                PLATFORM OVERVIEW
                            </span>

                            <h3>
                                System Statistics
                            </h3>

                        </div>

                    </div>


                    <div className="stats-grid">


                        {/* TOTAL SHOWS */}

                        <div className="stat-card">

                            <div className="stat-card-top">

                                <span className="stat-icon">
                                    🎬
                                </span>

                                <span className="stat-label">
                                    SHOWS
                                </span>

                            </div>

                            <strong className="stat-value">

                                {loading
                                    ? "—"
                                    : stats.totalShows}

                            </strong>

                            <span className="stat-description">
                                Total shows
                            </span>

                        </div>


                        {/* ACTIVE SHOWS */}

                        <div className="stat-card active-stat">

                            <div className="stat-card-top">

                                <span className="stat-icon">
                                    🟢
                                </span>

                                <span className="stat-label">
                                    LIVE
                                </span>

                            </div>

                            <strong className="stat-value">

                                {loading
                                    ? "—"
                                    : stats.activeShows}

                            </strong>

                            <span className="stat-description">
                                Active shows
                            </span>

                        </div>


                        {/* CONTESTANTS */}

                        <div className="stat-card">

                            <div className="stat-card-top">

                                <span className="stat-icon">
                                    👥
                                </span>

                                <span className="stat-label">
                                    CONTESTANTS
                                </span>

                            </div>

                            <strong className="stat-value">

                                {loading
                                    ? "—"
                                    : stats.totalContestants}

                            </strong>

                            <span className="stat-description">
                                Total contestants
                            </span>

                        </div>


                        {/* VOTES */}

                        <div className="stat-card">

                            <div className="stat-card-top">

                                <span className="stat-icon">
                                    🗳️
                                </span>

                                <span className="stat-label">
                                    VOTES
                                </span>

                            </div>

                            <strong className="stat-value">

                                {loading
                                    ? "—"
                                    : stats.totalVotes}

                            </strong>

                            <span className="stat-description">
                                Votes submitted
                            </span>

                        </div>


                        {/* USERS */}

                        <div className="stat-card">

                            <div className="stat-card-top">

                                <span className="stat-icon">
                                    👤
                                </span>

                                <span className="stat-label">
                                    USERS
                                </span>

                            </div>

                            <strong className="stat-value">

                                {loading
                                    ? "—"
                                    : stats.totalUsers}

                            </strong>

                            <span className="stat-description">
                                Registered users
                            </span>

                        </div>


                        {/* TODAY */}

                        <div className="stat-card today-stat">

                            <div className="stat-card-top">

                                <span className="stat-icon">
                                    📈
                                </span>

                                <span className="stat-label">
                                    TODAY
                                </span>

                            </div>

                            <strong className="stat-value">

                                {loading
                                    ? "—"
                                    : stats.votesToday}

                            </strong>

                            <span className="stat-description">
                                Votes today
                            </span>

                        </div>

                    </div>

                </section>


                {/* =================================
                    MANAGEMENT
                ================================= */}

                <section className="management-section">

                    <div className="admin-section-heading">

                        <div>

                            <span className="admin-eyebrow">
                                CONTROL CENTER
                            </span>

                            <h3>
                                Management
                            </h3>

                            <p>
                                Manage shows, contestants and
                                platform voting.
                            </p>

                        </div>

                    </div>


                    <div className="admin-cards">


                        {/* SHOWS */}

                        <article className="admin-card">

                            <div className="admin-card-icon">
                                🎬
                            </div>

                            <div className="admin-card-content">

                                <h3>
                                    Shows
                                </h3>

                                <p>
                                    Create, update and manage
                                    reality shows.
                                </p>

                            </div>

                            <button
                                onClick={() =>
                                    navigate("/admin/shows")
                                }
                            >
                                Manage Shows
                                <span>→</span>
                            </button>

                        </article>


                        {/* CONTESTANTS */}

                        <article className="admin-card">

                            <div className="admin-card-icon">
                                👥
                            </div>

                            <div className="admin-card-content">

                                <h3>
                                    Contestants
                                </h3>

                                <p>
                                    Add, edit and manage
                                    show contestants.
                                </p>

                            </div>

                            <button
                                onClick={() =>
                                    navigate(
                                        "/admin/contestants"
                                    )
                                }
                            >
                                Manage Contestants
                                <span>→</span>
                            </button>

                        </article>


                        {/* VOTING */}

                        <article className="admin-card">

                            <div className="admin-card-icon voting-icon">
                                🟢
                            </div>

                            <div className="admin-card-content">

                                <h3>
                                    Voting
                                </h3>

                                <p>
                                    Start or stop voting and
                                    monitor live results.
                                </p>

                            </div>

                            <button
                                onClick={() =>
                                    navigate(
                                        "/admin/voting"
                                    )
                                }
                            >
                                Manage Voting
                                <span>→</span>
                            </button>

                        </article>


                        {/* VOTE MANAGEMENT */}

                        <article className="admin-card">

                            <div className="admin-card-icon">
                                🗳️
                            </div>

                            <div className="admin-card-content">

                                <h3>
                                    Vote Management
                                </h3>

                                <p>
                                    Review submitted votes
                                    across the platform.
                                </p>

                            </div>

                            <button
                                onClick={() =>
                                    navigate(
                                        "/admin/votes"
                                    )
                                }
                            >
                                View All Votes
                                <span>→</span>
                            </button>

                        </article>

                    </div>

                </section>

            </main>

        </div>
    );
}


export default AdminDashboard;