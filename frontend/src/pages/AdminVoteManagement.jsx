import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import LogoutButton from "../components/LogoutButton";
import "./AdminVoteManagement.css";

function AdminVoteManagement() {

    const navigate = useNavigate();

    const [votes, setVotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [searchTerm, setSearchTerm] = useState("");
    const [selectedShow, setSelectedShow] = useState("");
    const [selectedContestant, setSelectedContestant] = useState("");

    /* Pagination */
    const [currentPage, setCurrentPage] = useState(1);
    const [votesPerPage, setVotesPerPage] = useState(10);

    /* Sorting */
    const [sortOrder, setSortOrder] = useState("newest");


    /* =========================================
       FETCH VOTES
    ========================================= */

    useEffect(() => {

        const fetchVotes = async () => {

            try {

                setLoading(true);
                setError("");

                const response =
                    await api.get("/votes/admin");

                setVotes(response.data);

            } catch (error) {

                setError(
                    error.response?.data?.error ||
                    "Unable to load vote records."
                );

            } finally {

                setLoading(false);
            }
        };

        fetchVotes();

    }, []);


    /* =========================================
       UNIQUE SHOWS
    ========================================= */

    const shows = useMemo(() => {

        const uniqueShows = new Map();

        votes.forEach((vote) => {

            if (!uniqueShows.has(vote.showId)) {

                uniqueShows.set(
                    vote.showId,
                    vote.showTitle
                );

            }

        });

        return Array.from(
            uniqueShows,
            ([id, title]) => ({
                id,
                title
            })
        );

    }, [votes]);


    /* =========================================
       UNIQUE CONTESTANTS
    ========================================= */

    const contestants = useMemo(() => {

        const uniqueContestants = new Map();

        votes.forEach((vote) => {

            if (!uniqueContestants.has(vote.contestantId)) {

                uniqueContestants.set(
                    vote.contestantId,
                    vote.contestantName
                );

            }

        });

        return Array.from(
            uniqueContestants,
            ([id, name]) => ({
                id,
                name
            })
        );

    }, [votes]);


    /* =========================================
       FILTER VOTES
    ========================================= */

    const filteredVotes = useMemo(() => {

        const search =
            searchTerm.trim().toLowerCase();

        return votes.filter((vote) => {

            const matchesSearch =
                !search ||
                vote.userName
                    ?.toLowerCase()
                    .includes(search) ||
                vote.userEmail
                    ?.toLowerCase()
                    .includes(search) ||
                vote.showTitle
                    ?.toLowerCase()
                    .includes(search) ||
                vote.contestantName
                    ?.toLowerCase()
                    .includes(search);

            const matchesShow =
                !selectedShow ||
                String(vote.showId) === selectedShow;

            const matchesContestant =
                !selectedContestant ||
                String(vote.contestantId) ===
                selectedContestant;

            return (
                matchesSearch &&
                matchesShow &&
                matchesContestant
            );

        });

    }, [
        votes,
        searchTerm,
        selectedShow,
        selectedContestant
    ]);


    /* =========================================
       SORT VOTES
    ========================================= */

    const sortedVotes = useMemo(() => {

        const sorted = [...filteredVotes];

        sorted.sort((a, b) => {

            const dateA =
                new Date(a.votedAt).getTime();

            const dateB =
                new Date(b.votedAt).getTime();

            if (sortOrder === "newest") {
                return dateB - dateA;
            }

            return dateA - dateB;

        });

        return sorted;

    }, [filteredVotes, sortOrder]);


    /* =========================================
       PAGINATION
    ========================================= */

    const totalPages = Math.max(
        1,
        Math.ceil(
            sortedVotes.length / votesPerPage
        )
    );


    const paginatedVotes = useMemo(() => {

        const startIndex =
            (currentPage - 1) * votesPerPage;

        const endIndex =
            startIndex + votesPerPage;

        return sortedVotes.slice(
            startIndex,
            endIndex
        );

    }, [
        sortedVotes,
        currentPage,
        votesPerPage
    ]);


    /* =========================================
       RESET PAGE WHEN FILTER CHANGES
    ========================================= */

    useEffect(() => {

        setCurrentPage(1);

    }, [
        searchTerm,
        selectedShow,
        selectedContestant,
        votesPerPage,
        sortOrder
    ]);


    /* =========================================
       PAGE SAFETY
    ========================================= */

    useEffect(() => {

        if (currentPage > totalPages) {
            setCurrentPage(totalPages);
        }

    }, [
        currentPage,
        totalPages
    ]);


    /* =========================================
       CLEAR FILTERS
    ========================================= */

    const clearFilters = () => {

        setSearchTerm("");
        setSelectedShow("");
        setSelectedContestant("");
        setCurrentPage(1);

    };


    const hasFilters =
        searchTerm ||
        selectedShow ||
        selectedContestant;


    /* =========================================
       DATE FORMAT
    ========================================= */

    const formatDateTime = (date) => {

        if (!date) {
            return "—";
        }

        return new Date(date).toLocaleString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
            }
        );

    };


    /* =========================================
       PAGE NUMBERS
    ========================================= */

    const pageNumbers = [];

    for (
        let page = 1;
        page <= totalPages;
        page++
    ) {

        pageNumbers.push(page);

    }


    /* =========================================
       RENDER
    ========================================= */

    return (
        <div className="admin-votes-page">

            {/* =========================
                HEADER
            ========================= */}

            <header className="admin-votes-header">

                <div>

                    <h1>
                        VoteLive Admin
                    </h1>

                    <p>
                        Vote Management
                    </p>

                </div>

                <div className="admin-votes-header-actions">

                    <button
                        className="back-button"
                        onClick={() =>
                            navigate("/admin")
                        }
                    >
                        ← Admin Dashboard
                    </button>

                    <LogoutButton />

                </div>

            </header>


            <main className="admin-votes-content">

                {/* =========================
                    INTRO
                ========================= */}

                <section className="admin-votes-intro">

                    <div>

                        <h2>
                            All Votes 🗳️
                        </h2>

                        <p>
                            View and filter all votes
                            submitted by users.
                        </p>

                    </div>

                    <div className="total-votes-badge">

                        <span>
                            TOTAL VOTES
                        </span>

                        <strong>
                            {votes.length}
                        </strong>

                    </div>

                </section>


                {/* =========================
                    FILTERS
                ========================= */}

                {!loading &&
                    !error &&
                    votes.length > 0 && (

                        <section className="vote-filters">

                            <div className="filter-header">

                                <div>

                                    <h3>
                                        Search & Filter
                                    </h3>

                                    <p>
                                        Find specific vote
                                        records quickly.
                                    </p>

                                </div>

                                {hasFilters && (

                                    <button
                                        className="clear-filters-button"
                                        onClick={clearFilters}
                                    >
                                        Clear Filters
                                    </button>

                                )}

                            </div>


                            <div className="filter-grid">

                                {/* SEARCH */}

                                <div className="filter-group search-group">

                                    <label>
                                        Search
                                    </label>

                                    <div className="search-input-wrapper">

                                        <span className="search-icon">
                                            🔎
                                        </span>

                                        <input
                                            type="text"
                                            value={searchTerm}
                                            onChange={(event) =>
                                                setSearchTerm(
                                                    event.target.value
                                                )
                                            }
                                            placeholder="Name, email, show or contestant..."
                                        />

                                    </div>

                                </div>


                                {/* SHOW */}

                                <div className="filter-group">

                                    <label>
                                        Show
                                    </label>

                                    <select
                                        value={selectedShow}
                                        onChange={(event) =>
                                            setSelectedShow(
                                                event.target.value
                                            )
                                        }
                                    >

                                        <option value="">
                                            All Shows
                                        </option>

                                        {shows.map(
                                            (show) => (

                                                <option
                                                    key={show.id}
                                                    value={show.id}
                                                >
                                                    {show.title}
                                                </option>

                                            )
                                        )}

                                    </select>

                                </div>


                                {/* CONTESTANT */}

                                <div className="filter-group">

                                    <label>
                                        Contestant
                                    </label>

                                    <select
                                        value={selectedContestant}
                                        onChange={(event) =>
                                            setSelectedContestant(
                                                event.target.value
                                            )
                                        }
                                    >

                                        <option value="">
                                            All Contestants
                                        </option>

                                        {contestants.map(
                                            (contestant) => (

                                                <option
                                                    key={contestant.id}
                                                    value={contestant.id}
                                                >
                                                    {contestant.name}
                                                </option>

                                            )
                                        )}

                                    </select>

                                </div>

                            </div>


                            {/* =========================
                                SORT + PAGE SIZE
                            ========================= */}

                            <div className="table-controls">

                                <div className="control-group">

                                    <label>
                                        Sort By
                                    </label>

                                    <select
                                        value={sortOrder}
                                        onChange={(event) =>
                                            setSortOrder(
                                                event.target.value
                                            )
                                        }
                                    >

                                        <option value="newest">
                                            Newest First
                                        </option>

                                        <option value="oldest">
                                            Oldest First
                                        </option>

                                    </select>

                                </div>


                                <div className="control-group">

                                    <label>
                                        Per Page
                                    </label>

                                    <select
                                        value={votesPerPage}
                                        onChange={(event) =>
                                            setVotesPerPage(
                                                Number(
                                                    event.target.value
                                                )
                                            )
                                        }
                                    >

                                        <option value={10}>
                                            10
                                        </option>

                                        <option value={25}>
                                            25
                                        </option>

                                        <option value={50}>
                                            50
                                        </option>

                                    </select>

                                </div>

                            </div>


                            {/* RESULT COUNT */}

                            <div className="filter-result">

                                <span>
                                    Showing{" "}
                                    <strong>
                                        {sortedVotes.length === 0
                                            ? 0
                                            : (
                                            (currentPage - 1) *
                                            votesPerPage
                                        ) + 1}
                                    </strong>
                                    {" - "}
                                    <strong>
                                        {Math.min(
                                            currentPage *
                                            votesPerPage,
                                            sortedVotes.length
                                        )}
                                    </strong>
                                    {" of "}
                                    <strong>
                                        {sortedVotes.length}
                                    </strong>
                                    {" filtered votes"}
                                </span>

                                {hasFilters &&
                                    sortedVotes.length === 0 && (

                                        <span className="no-results-text">
                                            No matching votes found.
                                        </span>

                                    )}

                            </div>

                        </section>
                    )}


                {/* =========================
                    LOADING
                ========================= */}

                {loading && (

                    <div className="admin-votes-state">

                        <div className="loading-spinner"></div>

                        <p>
                            Loading vote records...
                        </p>

                    </div>

                )}


                {/* =========================
                    ERROR
                ========================= */}

                {!loading && error && (

                    <div className="admin-votes-error">

                        <span>
                            ⚠️
                        </span>

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


                {/* =========================
                    NO VOTES
                ========================= */}

                {!loading &&
                    !error &&
                    votes.length === 0 && (

                        <div className="admin-votes-empty">

                            <div className="empty-icon">
                                🗳️
                            </div>

                            <h3>
                                No Votes Yet
                            </h3>

                            <p>
                                No votes have been submitted
                                in the system yet.
                            </p>

                        </div>

                    )}


                {/* =========================
                    NO FILTER RESULTS
                ========================= */}

                {!loading &&
                    !error &&
                    votes.length > 0 &&
                    sortedVotes.length === 0 && (

                        <div className="admin-votes-empty">

                            <div className="empty-icon">
                                🔎
                            </div>

                            <h3>
                                No Matching Votes
                            </h3>

                            <p>
                                No vote records match your
                                current search or filters.
                            </p>

                            <button
                                onClick={clearFilters}
                            >
                                Clear Filters
                            </button>

                        </div>

                    )}


                {/* =========================
                    TABLE
                ========================= */}

                {!loading &&
                    !error &&
                    paginatedVotes.length > 0 && (

                        <section className="admin-votes-table-section">

                            <div className="table-wrapper">

                                <table className="admin-votes-table">

                                    <thead>

                                    <tr>

                                        <th>
                                            Vote ID
                                        </th>

                                        <th>
                                            Voter
                                        </th>

                                        <th>
                                            Email
                                        </th>

                                        <th>
                                            Show
                                        </th>

                                        <th>
                                            Contestant
                                        </th>

                                        <th>
                                            Voted At
                                        </th>

                                    </tr>

                                    </thead>

                                    <tbody>

                                    {paginatedVotes.map(
                                        (vote) => (

                                            <tr
                                                key={vote.voteId}
                                            >

                                                <td>

                                                        <span className="vote-id">
                                                            #{vote.voteId}
                                                        </span>

                                                </td>


                                                <td>

                                                    <div className="voter-info">

                                                        <div className="voter-avatar">
                                                            {vote.userName
                                                                ?.charAt(0)
                                                                .toUpperCase()}
                                                        </div>

                                                        <strong>
                                                            {vote.userName}
                                                        </strong>

                                                    </div>

                                                </td>


                                                <td>

                                                        <span className="user-email">
                                                            {vote.userEmail}
                                                        </span>

                                                </td>


                                                <td>

                                                    <strong>
                                                        {vote.showTitle}
                                                    </strong>

                                                </td>


                                                <td>

                                                        <span className="contestant-badge">
                                                            {vote.contestantName}
                                                        </span>

                                                </td>


                                                <td>

                                                        <span className="vote-date">
                                                            {formatDateTime(
                                                                vote.votedAt
                                                            )}
                                                        </span>

                                                </td>

                                            </tr>

                                        )
                                    )}

                                    </tbody>

                                </table>

                            </div>


                            {/* =========================
                                PAGINATION
                            ========================= */}

                            {totalPages > 1 && (

                                <div className="pagination">

                                    <button
                                        className="pagination-button"
                                        disabled={
                                            currentPage === 1
                                        }
                                        onClick={() =>
                                            setCurrentPage(
                                                (page) =>
                                                    page - 1
                                            )
                                        }
                                    >
                                        ← Previous
                                    </button>


                                    <div className="page-numbers">

                                        {pageNumbers.map(
                                            (page) => (

                                                <button
                                                    key={page}
                                                    className={
                                                        page === currentPage
                                                            ? "page-number active"
                                                            : "page-number"
                                                    }
                                                    onClick={() =>
                                                        setCurrentPage(
                                                            page
                                                        )
                                                    }
                                                >
                                                    {page}
                                                </button>

                                            )
                                        )}

                                    </div>


                                    <button
                                        className="pagination-button"
                                        disabled={
                                            currentPage ===
                                            totalPages
                                        }
                                        onClick={() =>
                                            setCurrentPage(
                                                (page) =>
                                                    page + 1
                                            )
                                        }
                                    >
                                        Next →
                                    </button>

                                </div>

                            )}

                        </section>

                    )}

            </main>

        </div>
    );
}

export default AdminVoteManagement;