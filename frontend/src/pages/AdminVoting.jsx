import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client/dist/sockjs.js";
import api from "../services/api";
import "./AdminVoting.css";

function AdminVoting() {

    const navigate = useNavigate();

    const stompClientRef = useRef(null);

    const [shows, setShows] = useState([]);
    const [selectedShowId, setSelectedShowId] = useState("");

    const [results, setResults] = useState([]);
    const [selectedShow, setSelectedShow] = useState(null);

    const [loadingShows, setLoadingShows] = useState(true);
    const [loadingResults, setLoadingResults] = useState(false);

    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const [isLive, setIsLive] = useState(false);

    // ==========================================
    // ANALYTICS
    // ==========================================

    const [analytics, setAnalytics] = useState({
        totalVotes: 0,
        leadingContestantId: null,
        leadingContestantName: null,
        leadingVoteCount: 0,
        leadingPercentage: 0
    });


    // ==========================================
    // UPDATE ANALYTICS
    // ==========================================

    const updateAnalyticsFromResults = (updatedResults) => {

        if (
            !updatedResults ||
            updatedResults.length === 0
        ) {

            setAnalytics({
                totalVotes: 0,
                leadingContestantId: null,
                leadingContestantName: null,
                leadingVoteCount: 0,
                leadingPercentage: 0
            });

            return;
        }


        const totalVotes =
            updatedResults.reduce(
                (sum, result) =>
                    sum +
                    Number(result.voteCount || 0),
                0
            );


        const highestVotes =
            Math.max(
                ...updatedResults.map(
                    result =>
                        Number(
                            result.voteCount || 0
                        )
                )
            );


        const leaders =
            updatedResults.filter(
                result =>
                    Number(
                        result.voteCount || 0
                    ) === highestVotes
            );


        const leaderNames =
            leaders
                .map(
                    leader =>
                        leader.contestantName
                )
                .join(" & ");


        const firstLeader =
            leaders[0];


        const leadingPercentage =
            totalVotes === 0
                ? 0
                : Math.round(
                (
                    highestVotes *
                    100 /
                    totalVotes
                ) * 100
            ) / 100;


        setAnalytics({

            totalVotes,

            leadingContestantId:
                firstLeader?.contestantId ||
                null,

            leadingContestantName:
            leaderNames,

            leadingVoteCount:
            highestVotes,

            leadingPercentage
        });
    };


    // ==========================================
    // FETCH SHOWS
    // ==========================================

    const fetchShows = async () => {

        try {

            setError("");

            const response =
                await api.get("/shows");

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


    // ==========================================
    // FETCH RESULTS
    // ==========================================

    const fetchResults = async (showId) => {

        if (!showId) {

            setResults([]);

            updateAnalyticsFromResults([]);

            return;
        }

        try {

            setLoadingResults(true);

            setError("");

            const response =
                await api.get(
                    "/votes/results/show/" +
                    showId
                );

            setResults(response.data);

            updateAnalyticsFromResults(
                response.data
            );

        } catch (error) {

            setError(
                error.response?.data?.error ||
                "Unable to load voting results."
            );

        } finally {

            setLoadingResults(false);
        }
    };


    // ==========================================
    // FETCH ANALYTICS
    // ==========================================

    const fetchAnalytics = async (showId) => {

        if (!showId) {

            setAnalytics({
                totalVotes: 0,
                leadingContestantId: null,
                leadingContestantName: null,
                leadingVoteCount: 0,
                leadingPercentage: 0
            });

            return;
        }

        try {

            const response =
                await api.get(
                    "/votes/analytics/show/" +
                    showId
                );

            setAnalytics(response.data);

        } catch (error) {

            console.error(
                "Unable to load voting analytics:",
                error
            );
        }
    };


    // ==========================================
    // LOAD SHOWS
    // ==========================================

    useEffect(() => {

        fetchShows();

    }, []);


    // ==========================================
    // HANDLE SHOW SELECTION
    // ==========================================

    useEffect(() => {

        if (!selectedShowId) {

            setSelectedShow(null);
            setResults([]);

            setAnalytics({
                totalVotes: 0,
                leadingContestantId: null,
                leadingContestantName: null,
                leadingVoteCount: 0,
                leadingPercentage: 0
            });

            return;
        }


        const show =
            shows.find(
                item =>
                    String(item.id) ===
                    String(selectedShowId)
            );


        setSelectedShow(
            show || null
        );


        fetchResults(
            selectedShowId
        );

    }, [selectedShowId, shows]);


    // ==========================================
    // WEBSOCKET CONNECTION
    // ==========================================

    useEffect(() => {

        if (!selectedShowId) {
            return;
        }

        const showId =
            selectedShowId;


        const client =
            new Client({

                webSocketFactory: () =>
                    new SockJS(
                        "http://localhost:8080/ws"
                    ),

                reconnectDelay: 5000,

                debug: () => {
                    // Disable STOMP debug logs
                },


                onConnect: () => {

                    console.log(
                        "Admin WebSocket connected"
                    );

                    setIsLive(true);


                    client.subscribe(

                        "/topic/show/" +
                        showId +
                        "/results",

                        (message) => {

                            try {

                                const updatedResults =
                                    JSON.parse(
                                        message.body
                                    );


                                setResults(
                                    updatedResults
                                );


                                updateAnalyticsFromResults(
                                    updatedResults
                                );

                            } catch (error) {

                                console.error(
                                    "Unable to process live results:",
                                    error
                                );
                            }
                        }
                    );
                },


                onDisconnect: () => {

                    console.log(
                        "Admin WebSocket disconnected"
                    );

                    setIsLive(false);
                },


                onStompError: (frame) => {

                    console.error(
                        "STOMP error:",
                        frame
                    );

                    setIsLive(false);
                },


                onWebSocketError: (error) => {

                    console.error(
                        "WebSocket error:",
                        error
                    );

                    setIsLive(false);
                }
            });


        stompClientRef.current =
            client;

        client.activate();


        return () => {

            setIsLive(false);

            if (stompClientRef.current) {

                stompClientRef.current.deactivate();

                stompClientRef.current = null;
            }
        };

    }, [selectedShowId]);


    // ==========================================
    // START VOTING
    // ==========================================

    const handleStartVoting = async () => {

        if (!selectedShowId) {
            return;
        }

        try {

            setError("");
            setMessage("");

            const response =
                await api.put(
                    "/shows/" +
                    selectedShowId +
                    "/start"
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


    // ==========================================
    // STOP VOTING
    // ==========================================

    const handleStopVoting = async () => {

        if (!selectedShowId) {
            return;
        }

        try {

            setError("");
            setMessage("");

            const response =
                await api.put(
                    "/shows/" +
                    selectedShowId +
                    "/stop"
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


    // ==========================================
    // TOTAL VOTES
    // ==========================================

    const totalVotes =
        results.reduce(
            (sum, result) =>
                sum +
                Number(
                    result.voteCount || 0
                ),
            0
        );


    // ==========================================
    // RENDER
    // ==========================================

    return (

        <div className="admin-voting-page">


            {/* ==================================
                HEADER
            ================================== */}

            <header className="admin-voting-header">

                <div>

                    <h1>
                        Voting Management
                    </h1>

                    <p>
                        Control voting and monitor live results
                    </p>

                </div>


                <button
                    className="back-button"
                    onClick={() =>
                        navigate("/admin")
                    }
                >
                    Back to Dashboard
                </button>

            </header>


            <main className="admin-voting-content">


                {/* SUCCESS */}

                {message && (

                    <div className="success-message">
                        {message}
                    </div>

                )}


                {/* ERROR */}

                {error && (

                    <div className="error-message">
                        {error}
                    </div>

                )}


                {/* ==================================
                    SHOW CONTROL
                ================================== */}

                <section className="voting-control-card">

                    <div className="show-selector">

                        <label>
                            Select Show
                        </label>


                        {loadingShows ? (

                            <p>
                                Loading shows...
                            </p>

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


                    {selectedShow && (

                        <div className="voting-control">

                            <div>

                                <h2>
                                    {selectedShow.title}
                                </h2>


                                <span
                                    className={
                                        selectedShow.votingActive
                                            ? "status active"
                                            : "status inactive"
                                    }
                                >

                                    {selectedShow.votingActive
                                        ? "Voting Active"
                                        : "Voting Closed"}

                                </span>

                            </div>


                            <div className="voting-buttons">

                                {selectedShow.votingActive ? (

                                    <button
                                        className="stop-button"
                                        onClick={
                                            handleStopVoting
                                        }
                                    >
                                        Stop Voting
                                    </button>

                                ) : (

                                    <button
                                        className="start-button"
                                        onClick={
                                            handleStartVoting
                                        }
                                    >
                                        Start Voting
                                    </button>

                                )}

                            </div>

                        </div>

                    )}

                </section>


                {/* ==================================
                    ANALYTICS
                ================================== */}

                <section className="analytics-section">


                    <div className="analytics-card">

                        <div className="analytics-icon">
                            🗳️
                        </div>

                        <div>

                            <p>
                                Total Votes
                            </p>

                            <h3>
                                {analytics.totalVotes}
                            </h3>

                        </div>

                    </div>


                    <div className="analytics-card">

                        <div className="analytics-icon">
                            🏆
                        </div>

                        <div>

                            <p>
                                {analytics.leadingContestantName?.includes(" & ")
                                    ? "Current Leaders"
                                    : "Current Leader"}
                            </p>

                            <h3>
                                {analytics.leadingContestantName ||
                                    "No leader yet"}
                            </h3>

                        </div>

                    </div>


                    <div className="analytics-card">

                        <div className="analytics-icon">
                            📊
                        </div>

                        <div>

                            <p>
                                Leader Votes
                            </p>

                            <h3>
                                {analytics.leadingVoteCount}
                            </h3>

                        </div>

                    </div>


                    <div className="analytics-card">

                        <div className="analytics-icon">
                            📈
                        </div>

                        <div>

                            <p>
                                Leader Percentage
                            </p>

                            <h3>
                                {analytics.leadingPercentage}%
                            </h3>

                        </div>

                    </div>

                </section>


                {/* ==================================
                    VOTE DISTRIBUTION CHART
                ================================== */}

                <section className="chart-section">

                    <div className="chart-header">

                        <div>

                            <div className="chart-title-row">

                                <h2>
                                    Vote Distribution
                                </h2>

                                {isLive && (

                                    <span className="live-indicator">

                                        <span className="live-dot">
                                        </span>

                                        LIVE

                                    </span>

                                )}

                            </div>

                            <p>
                                Vote share by contestant
                            </p>

                        </div>

                    </div>


                    {results.length === 0 ? (

                        <div className="chart-empty">

                            <div className="chart-empty-icon">
                                📊
                            </div>

                            <h3>
                                No votes yet
                            </h3>

                            <p>
                                Vote distribution will appear
                                here once voting begins.
                            </p>

                        </div>

                    ) : (

                        <div className="distribution-chart">

                            {results.map((result) => (

                                <div
                                    className="distribution-row"
                                    key={result.contestantId}
                                >

                                    <div className="distribution-info">

                                        <span className="distribution-name">
                                            {result.contestantName}
                                        </span>

                                        <span className="distribution-value">
                                            {result.voteCount}{" "}
                                            {Number(result.voteCount) === 1
                                                ? "vote"
                                                : "votes"}
                                            {" • "}
                                            {result.votePercentage}%
                                        </span>

                                    </div>


                                    <div className="distribution-bar-container">

                                        <div
                                            className="distribution-bar"
                                            style={{
                                                width:
                                                    Math.max(
                                                        Number(
                                                            result.votePercentage || 0
                                                        ),
                                                        result.voteCount > 0
                                                            ? 2
                                                            : 0
                                                    ) + "%"
                                            }}
                                        />

                                    </div>

                                </div>

                            ))}

                        </div>

                    )}

                </section>


                {/* ==================================
                    LIVE RESULTS
                ================================== */}

                <section className="results-section">


                    <div className="results-header">

                        <div>

                            <div className="results-title-row">

                                <h2>
                                    Live Voting Results
                                </h2>

                                {isLive && (

                                    <span className="live-indicator">

                                        <span className="live-dot">
                                        </span>

                                        LIVE

                                    </span>

                                )}

                            </div>


                            <p>
                                {totalVotes} total votes
                            </p>

                        </div>


                        <button
                            className="refresh-button"
                            onClick={() => {

                                fetchResults(
                                    selectedShowId
                                );


                            }}
                        >
                            Refresh Results
                        </button>

                    </div>


                    {loadingResults ? (

                        <div className="loading">
                            Loading results...
                        </div>

                    ) : results.length === 0 ? (

                        <div className="empty-state">

                            No voting results available.

                        </div>

                    ) : (

                        <div className="results-list">

                            {results.map((result) => (

                                <div
                                    className="result-card"
                                    key={result.contestantId}
                                >

                                    <div className="result-main">


                                        <div className="rank">

                                            #{result.rank}

                                        </div>


                                        <div className="contestant-result">

                                            <div className="result-name-row">

                                                <h3>
                                                    {
                                                        result.contestantName
                                                    }
                                                </h3>


                                                {result.leading && (

                                                    <span className="leading-badge">

                                                        Leading

                                                    </span>

                                                )}

                                            </div>


                                            <div className="progress-container">

                                                <div
                                                    className="progress-bar"
                                                    style={{
                                                        width:
                                                            result.votePercentage +
                                                            "%"
                                                    }}
                                                />

                                            </div>

                                        </div>


                                        <div className="vote-numbers">

                                            <strong>
                                                {
                                                    result.voteCount
                                                }
                                            </strong>

                                            <span>
                                                {
                                                    result.votePercentage
                                                }%
                                            </span>

                                        </div>

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

export default AdminVoting;