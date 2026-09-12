import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./AdminDashboard.css";

function AdminDashboard() {

    const navigate = useNavigate();

    const [stats, setStats] = useState({
        totalShows: 0,
        activeShows: 0,
        totalContestants: 0,
        totalVotes: 0
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const userRole = localStorage.getItem("role");

    useEffect(() => {

        if (userRole !== "ADMIN") {
            setLoading(false);
            return;
        }

        const fetchStats = async () => {

            try {

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

    if (userRole !== "ADMIN") {

        return (
            <div className="admin-access-denied">

                <h1>Access Denied</h1>

                <p>
                    You do not have permission to access
                    the admin dashboard.
                </p>

                <button
                    onClick={() => navigate("/")}
                >
                    Go Home
                </button>

            </div>
        );
    }

    return (
        <div className="admin-dashboard">

            {/* =========================
                HEADER
            ========================= */}

            <header className="admin-header">

                <div>

                    <h1>
                        VoteLive Admin
                    </h1>

                    <p>
                        Manage shows, contestants and voting
                    </p>

                </div>

                <button
                    className="back-button"
                    onClick={() => navigate("/")}
                >
                    Back to Home
                </button>

            </header>


            {/* =========================
                MAIN CONTENT
            ========================= */}

            <main className="admin-content">

                {/* Welcome */}

                <section className="admin-welcome">

                    <h2>
                        Admin Dashboard
                    </h2>

                    <p>
                        Welcome to the VoteLive administration panel.
                    </p>

                </section>


                {/* Error */}

                {error && (

                    <div className="error-message">
                        {error}
                    </div>

                )}


                {/* =========================
                    STATISTICS
                ========================= */}

                <section className="stats-grid">


                    {/* Total Shows */}

                    <div className="stat-card">

                        <div className="stat-icon">
                            🎬
                        </div>

                        <div>

                            <p>
                                Total Shows
                            </p>

                            <h3>
                                {loading
                                    ? "—"
                                    : stats.totalShows}
                            </h3>

                        </div>

                    </div>


                    {/* Active Shows */}

                    <div className="stat-card">

                        <div className="stat-icon">
                            🟢
                        </div>

                        <div>

                            <p>
                                Active Shows
                            </p>

                            <h3>
                                {loading
                                    ? "—"
                                    : stats.activeShows}
                            </h3>

                        </div>

                    </div>


                    {/* Total Contestants */}

                    <div className="stat-card">

                        <div className="stat-icon">
                            👥
                        </div>

                        <div>

                            <p>
                                Total Contestants
                            </p>

                            <h3>
                                {loading
                                    ? "—"
                                    : stats.totalContestants}
                            </h3>

                        </div>

                    </div>


                    {/* Total Votes */}

                    <div className="stat-card">

                        <div className="stat-icon">
                            🗳️
                        </div>

                        <div>

                            <p>
                                Total Votes
                            </p>

                            <h3>
                                {loading
                                    ? "—"
                                    : stats.totalVotes}
                            </h3>

                        </div>

                    </div>

                </section>


                {/* =========================
                    ADMIN MANAGEMENT CARDS
                ========================= */}

                <section className="admin-cards">


                    {/* =========================
                        SHOWS
                    ========================= */}

                    <div className="admin-card">

                        <h3>
                            Shows
                        </h3>

                        <p>
                            Create and manage reality shows.
                        </p>

                        <button
                            onClick={() =>
                                navigate("/admin/shows")
                            }
                        >
                            Manage Shows
                        </button>

                    </div>


                    {/* =========================
                        CONTESTANTS
                    ========================= */}

                    <div className="admin-card">

                        <h3>
                            Contestants
                        </h3>

                        <p>
                            Add and manage contestants.
                        </p>

                        <button
                            onClick={() =>
                                navigate("/admin/contestants")
                            }
                        >
                            Manage Contestants
                        </button>

                    </div>


                    {/* =========================
                        VOTING
                    ========================= */}

                    <div className="admin-card">

                        <h3>
                            Voting
                        </h3>

                        <p>
                            Start or stop voting and monitor
                            live results.
                        </p>

                        <button
                            onClick={() =>
                                navigate("/admin/voting")
                            }
                        >
                            Manage Voting
                        </button>

                    </div>

                </section>

            </main>

        </div>
    );
}

export default AdminDashboard;