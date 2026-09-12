import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./AdminContestants.css";

function AdminContestants() {

    const navigate = useNavigate();

    const [shows, setShows] = useState([]);
    const [selectedShowId, setSelectedShowId] = useState("");

    const [contestants, setContestants] = useState([]);

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [imageUrl, setImageUrl] = useState("");

    const [editingId, setEditingId] = useState(null);
    const [editName, setEditName] = useState("");
    const [editDescription, setEditDescription] = useState("");
    const [editImageUrl, setEditImageUrl] = useState("");

    const [loadingShows, setLoadingShows] = useState(true);
    const [loadingContestants, setLoadingContestants] = useState(false);
    const [creating, setCreating] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [deletingId, setDeletingId] = useState(null);

    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const fetchShows = async () => {

        try {

            setError("");

            const response = await api.get("/shows");

            setShows(response.data);

            if (
                response.data.length > 0 &&
                !selectedShowId
            ) {
                setSelectedShowId(
                    String(response.data[0].id)
                );
            }

        } catch (error) {

            setError(
                error.response?.data?.error ||
                "Unable to load shows."
            );

        } finally {

            setLoadingShows(false);
        }
    };

    const fetchContestants = async (showId) => {

        if (!showId) {
            setContestants([]);
            return;
        }

        try {

            setLoadingContestants(true);
            setError("");

            const response = await api.get(
                "/contestants/show/" + showId
            );

            setContestants(response.data);

        } catch (error) {

            setError(
                error.response?.data?.error ||
                "Unable to load contestants."
            );

        } finally {

            setLoadingContestants(false);
        }
    };

    useEffect(() => {
        fetchShows();
    }, []);

    useEffect(() => {

        if (selectedShowId) {
            fetchContestants(selectedShowId);
        }

    }, [selectedShowId]);

    const handleCreateContestant = async (event) => {

        event.preventDefault();

        if (!selectedShowId) {
            setError("Please select a show.");
            return;
        }

        try {

            setError("");
            setMessage("");
            setCreating(true);

            await api.post("/contestants", {
                name,
                description,
                imageUrl,
                showId: Number(selectedShowId)
            });

            setMessage(
                "Contestant added successfully."
            );

            setName("");
            setDescription("");
            setImageUrl("");

            await fetchContestants(selectedShowId);

        } catch (error) {

            setError(
                error.response?.data?.error ||
                "Unable to add contestant."
            );

        } finally {

            setCreating(false);
        }
    };

    const startEditing = (contestant) => {

        setError("");
        setMessage("");

        setEditingId(contestant.id);

        setEditName(contestant.name || "");
        setEditDescription(contestant.description || "");
        setEditImageUrl(contestant.imageUrl || "");
    };

    const cancelEditing = () => {

        setEditingId(null);

        setEditName("");
        setEditDescription("");
        setEditImageUrl("");
    };

    const handleUpdateContestant = async (contestantId) => {

        if (!editName.trim()) {
            setError("Contestant name cannot be empty.");
            return;
        }

        try {

            setError("");
            setMessage("");
            setUpdating(true);

            await api.put(
                "/contestants/" + contestantId,
                {
                    name: editName,
                    description: editDescription,
                    imageUrl: editImageUrl,
                    showId: Number(selectedShowId)
                }
            );

            setMessage(
                "Contestant updated successfully."
            );

            cancelEditing();

            await fetchContestants(selectedShowId);

        } catch (error) {

            setError(
                error.response?.data?.error ||
                "Unable to update contestant."
            );

        } finally {

            setUpdating(false);
        }
    };

    const handleDeleteContestant = async (contestant) => {

        const confirmed = window.confirm(
            "Are you sure you want to delete " +
            contestant.name +
            "?"
        );

        if (!confirmed) {
            return;
        }

        try {

            setError("");
            setMessage("");
            setDeletingId(contestant.id);

            await api.delete(
                "/contestants/" + contestant.id
            );

            setMessage(
                "Contestant deleted successfully."
            );

            await fetchContestants(selectedShowId);

        } catch (error) {

            setError(
                error.response?.data?.error ||
                "Unable to delete contestant."
            );

        } finally {

            setDeletingId(null);
        }
    };

    return (
        <div className="admin-contestants-page">

            <header className="admin-contestants-header">

                <div>
                    <h1>Manage Contestants</h1>

                    <p>
                        Add and manage contestants for each show
                    </p>
                </div>

                <button
                    className="back-button"
                    onClick={() => navigate("/admin")}
                >
                    Back to Dashboard
                </button>

            </header>

            <main className="admin-contestants-content">

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

                <section className="contestant-form-card">

                    <h2>Add Contestant</h2>

                    <div className="form-group">

                        <label>
                            Select Show
                        </label>

                        {loadingShows ? (

                            <p>Loading shows...</p>

                        ) : (

                            <select
                                value={selectedShowId}
                                onChange={(event) =>
                                    setSelectedShowId(
                                        event.target.value
                                    )
                                }
                            >

                                <option value="">
                                    Select a show
                                </option>

                                {shows.map((show) => (

                                    <option
                                        key={show.id}
                                        value={show.id}
                                    >
                                        {show.title}
                                    </option>

                                ))}

                            </select>
                        )}

                    </div>

                    <form onSubmit={handleCreateContestant}>

                        <div className="form-group">

                            <label>
                                Contestant Name
                            </label>

                            <input
                                type="text"
                                value={name}
                                onChange={(event) =>
                                    setName(event.target.value)
                                }
                                placeholder="Enter contestant name"
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
                                    setDescription(
                                        event.target.value
                                    )
                                }
                                placeholder="Enter contestant description"
                                rows="4"
                            />

                        </div>

                        <div className="form-group">

                            <label>
                                Image URL
                                <span className="optional">
                                    Optional
                                </span>
                            </label>

                            <input
                                type="url"
                                value={imageUrl}
                                onChange={(event) =>
                                    setImageUrl(
                                        event.target.value
                                    )
                                }
                                placeholder="https://example.com/image.jpg"
                            />

                        </div>

                        <button
                            type="submit"
                            className="add-button"
                            disabled={
                                creating ||
                                !selectedShowId
                            }
                        >
                            {creating
                                ? "Adding..."
                                : "Add Contestant"}
                        </button>

                    </form>

                </section>

                <section className="contestants-section">

                    <div className="section-heading">

                        <div>
                            <h2>Contestants</h2>

                            {selectedShowId && (
                                <p>
                                    Showing contestants for selected show
                                </p>
                            )}
                        </div>

                        <button
                            className="refresh-button"
                            onClick={() =>
                                fetchContestants(
                                    selectedShowId
                                )
                            }
                        >
                            Refresh
                        </button>

                    </div>

                    {loadingContestants ? (

                        <div className="loading">
                            Loading contestants...
                        </div>

                    ) : contestants.length === 0 ? (

                        <div className="empty-state">
                            No contestants found for this show.
                        </div>

                    ) : (

                        <div className="contestants-grid">

                            {contestants.map((contestant) => (

                                <div
                                    className="contestant-card"
                                    key={contestant.id}
                                >

                                    {editingId === contestant.id ? (

                                        <div className="edit-contestant-form">

                                            <h3>
                                                Edit Contestant
                                            </h3>

                                            <div className="form-group">

                                                <label>
                                                    Name
                                                </label>

                                                <input
                                                    type="text"
                                                    value={editName}
                                                    onChange={(event) =>
                                                        setEditName(
                                                            event.target.value
                                                        )
                                                    }
                                                />

                                            </div>

                                            <div className="form-group">

                                                <label>
                                                    Description
                                                </label>

                                                <textarea
                                                    value={editDescription}
                                                    onChange={(event) =>
                                                        setEditDescription(
                                                            event.target.value
                                                        )
                                                    }
                                                    rows="3"
                                                />

                                            </div>

                                            <div className="form-group">

                                                <label>
                                                    Image URL
                                                </label>

                                                <input
                                                    type="url"
                                                    value={editImageUrl}
                                                    onChange={(event) =>
                                                        setEditImageUrl(
                                                            event.target.value
                                                        )
                                                    }
                                                    placeholder="https://example.com/image.jpg"
                                                />

                                            </div>

                                            <div className="edit-actions">

                                                <button
                                                    className="save-button"
                                                    onClick={() =>
                                                        handleUpdateContestant(
                                                            contestant.id
                                                        )
                                                    }
                                                    disabled={updating}
                                                >
                                                    {updating
                                                        ? "Saving..."
                                                        : "Save Changes"}
                                                </button>

                                                <button
                                                    className="cancel-button"
                                                    onClick={
                                                        cancelEditing
                                                    }
                                                    disabled={updating}
                                                >
                                                    Cancel
                                                </button>

                                            </div>

                                        </div>

                                    ) : (

                                        <>
                                            <div className="contestant-image">

                                                {contestant.imageUrl ? (

                                                    <img
                                                        src={contestant.imageUrl}
                                                        alt={contestant.name}
                                                        onError={(event) => {
                                                            event.currentTarget.style.display =
                                                                "none";

                                                            event.currentTarget
                                                                .nextElementSibling
                                                                .style.display =
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

                                            </div>

                                            <div className="contestant-info">

                                                <h3>
                                                    {contestant.name}
                                                </h3>

                                                <p>
                                                    {contestant.description ||
                                                        "No description provided."}
                                                </p>

                                                <span>
                                                    Contestant #
                                                    {contestant.id}
                                                </span>

                                                <div className="contestant-actions">

                                                    <button
                                                        className="edit-button"
                                                        onClick={() =>
                                                            startEditing(
                                                                contestant
                                                            )
                                                        }
                                                    >
                                                        Edit
                                                    </button>

                                                    <button
                                                        className="delete-button"
                                                        onClick={() =>
                                                            handleDeleteContestant(
                                                                contestant
                                                            )
                                                        }
                                                        disabled={
                                                            deletingId ===
                                                            contestant.id
                                                        }
                                                    >
                                                        {deletingId ===
                                                        contestant.id
                                                            ? "Deleting..."
                                                            : "Delete"}
                                                    </button>

                                                </div>

                                            </div>
                                        </>
                                    )}

                                </div>

                            ))}

                        </div>

                    )}

                </section>

            </main>

        </div>
    );
}

export default AdminContestants;