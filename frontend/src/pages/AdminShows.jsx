import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./AdminShows.css";

function AdminShows() {

    const navigate = useNavigate();

    const [shows, setShows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [creating, setCreating] = useState(false);

    const fetchShows = async () => {

        try {

            setError("");

            const response = await api.get("/shows");

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

    useEffect(() => {
        fetchShows();
    }, []);

    const handleCreateShow = async (event) => {

        event.preventDefault();

        setError("");
        setMessage("");
        setCreating(true);

        try {

            await api.post("/shows", {
                title,
                description
            });

            setMessage("Show created successfully.");

            setTitle("");
            setDescription("");

            await fetchShows();

        } catch (error) {

            setError(
                error.response?.data?.error ||
                "Unable to create show."
            );

        } finally {

            setCreating(false);
        }
    };

    const handleStartVoting = async (showId) => {

        setError("");
        setMessage("");

        try {

            const response =
                await api.put(
                    "/shows/" + showId + "/start"
                );

            setMessage(
                response.data.message ||
                "Voting started successfully."
            );

            await fetchShows();

        } catch (error) {

            setError(
                error.response?.data?.error ||
                "Unable to start voting."
            );
        }
    };

    const handleStopVoting = async (showId) => {

        setError("");
        setMessage("");

        try {

            const response =
                await api.put(
                    "/shows/" + showId + "/stop"
                );

            setMessage(
                response.data.message ||
                "Voting stopped successfully."
            );

            await fetchShows();

        } catch (error) {

            setError(
                error.response?.data?.error ||
                "Unable to stop voting."
            );
        }
    };

    return (
        <div className="admin-shows-page">

            <header className="admin-shows-header">

                <div>
                    <h1>Manage Shows</h1>
                    <p>
                        Create and control VoteLive shows
                    </p>
                </div>

                <button
                    className="back-button"
                    onClick={() => navigate("/admin")}
                >
                    Back to Dashboard
                </button>

            </header>

            <main className="admin-shows-content">

                {message && (
                    <div className="success-message">
                        {message}
                    </div>
                )}

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                <section className="create-show-card">

                    <h2>Create New Show</h2>

                    <form onSubmit={handleCreateShow}>

                        <div className="form-group">

                            <label>
                                Show Title
                            </label>

                            <input
                                type="text"
                                value={title}
                                onChange={(event) =>
                                    setTitle(event.target.value)
                                }
                                placeholder="Enter show title"
                                required
                            />

                        </div>

                        <div className="form-group">

                            <label>
                                Description
                            </label>

                            <textarea
                                value={description}
                                onChange={(event) =>
                                    setDescription(event.target.value)
                                }
                                placeholder="Enter show description"
                                rows="4"
                            />

                        </div>

                        <button
                            type="submit"
                            className="create-button"
                            disabled={creating}
                        >
                            {creating
                                ? "Creating..."
                                : "Create Show"}
                        </button>

                    </form>

                </section>

                <section className="shows-section">

                    <div className="section-heading">

                        <h2>Existing Shows</h2>

                        <button
                            className="refresh-button"
                            onClick={fetchShows}
                        >
                            Refresh
                        </button>

                    </div>

                    {loading ? (

                        <div className="loading">
                            Loading shows...
                        </div>

                    ) : shows.length === 0 ? (

                        <div className="empty-state">
                            No shows found.
                        </div>

                    ) : (

                        <div className="shows-grid">

                            {shows.map((show) => (

                                <div
                                    className="show-card"
                                    key={show.id}
                                >

                                    <div className="show-card-header">

                                        <div>
                                            <h3>
                                                {show.title}
                                            </h3>

                                            <span>
                                                Show #{show.id}
                                            </span>
                                        </div>

                                        <span
                                            className={
                                                show.votingActive
                                                    ? "status active"
                                                    : "status inactive"
                                            }
                                        >
                                            {show.votingActive
                                                ? "Voting Active"
                                                : "Voting Closed"}
                                        </span>

                                    </div>

                                    <p className="show-description">
                                        {show.description ||
                                            "No description provided."}
                                    </p>

                                    <div className="show-actions">

                                        {show.votingActive ? (

                                            <button
                                                className="stop-button"
                                                onClick={() =>
                                                    handleStopVoting(
                                                        show.id
                                                    )
                                                }
                                            >
                                                Stop Voting
                                            </button>

                                        ) : (

                                            <button
                                                className="start-button"
                                                onClick={() =>
                                                    handleStartVoting(
                                                        show.id
                                                    )
                                                }
                                            >
                                                Start Voting
                                            </button>

                                        )}

                                        <button
                                            className="view-button"
                                            onClick={() =>
                                                navigate(
                                                    "/shows/" +
                                                    show.id
                                                )
                                            }
                                        >
                                            View Show
                                        </button>

                                    </div>

                                </div>

                            ))}

                        </div>

                    )}

                </section>

            </main>

        </div>
    );
}

export default AdminShows;