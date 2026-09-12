import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function UserDashboard() {

    const [shows, setShows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchShows = async () => {
            try {
                const response = await api.get("/shows");
                setShows(response.data);
            } catch (error) {
                setError("Unable to load shows.");
            } finally {
                setLoading(false);
            }
        };

        fetchShows();
    }, []);

    if (loading) {
        return (
            <div className="dashboard-page">
                <h1>VoteLive</h1>
                <p>Loading shows...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="dashboard-page">
                <h1>VoteLive</h1>
                <p className="error-message">{error}</p>
            </div>
        );
    }

    return (
        <div className="dashboard-page">

            <header className="dashboard-header">
                <div>
                    <h1>VoteLive</h1>
                    <p>Reality Show Voting Dashboard</p>
                </div>
            </header>

            <main className="shows-section">

                <h2>Available Shows</h2>

                {shows.length === 0 ? (
                    <p>No shows available.</p>
                ) : (
                    <div className="show-grid">

                        {shows.map((show) => (
                            <div
                                className="show-card"
                                key={show.id}
                            >

                                <h3>{show.title}</h3>

                                <p>
                                    {show.description}
                                </p>

                                <div className="show-status">
                                    {show.votingActive ? (
                                        <span className="active-status">
                                            🟢 Voting Active
                                        </span>
                                    ) : (
                                        <span className="closed-status">
                                            🔴 Voting Closed
                                        </span>
                                    )}
                                </div>

                                <button
                                    onClick={() => navigate(`/show/${show.id}`)}
                                >
                                    View Show
                                </button>

                            </div>
                        ))}

                    </div>
                )}

            </main>

        </div>
    );
}

export default UserDashboard;