import {
    BrowserRouter,
    Routes,
    Route,
    Navigate,
    useNavigate
} from "react-router-dom";

import Login from "./pages/Login";
import UserDashboard from "./pages/UserDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import ShowPage from "./pages/ShowPage";
import "./App.css";
import AdminDashboard from "./pages/AdminDashboard";
import AdminShows from "./pages/AdminShows";
import AdminContestants from "./pages/AdminContestants";
import AdminVoting from "./pages/AdminVoting";

function Home() {
    const navigate = useNavigate();

    return (
        <div className="app">
            <header className="navbar">
                <h1>VoteLive</h1>
                <span>Real-Time Reality Show Voting</span>
            </header>

            <main className="hero">
                <h2>Welcome to VoteLive</h2>

                <p>
                    Vote for your favorite contestant and follow the
                    results in real time.
                </p>

                <button onClick={() => navigate("/login")}>
                    Get Started
                </button>
            </main>
        </div>
    );
}

function App() {
    return (
        <BrowserRouter>
            <Routes>

                {/* Landing Page */}
                <Route
                    path="/"
                    element={<Home />}
                />

                {/* Login */}
                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/admin/voting"
                    element={<AdminVoting />}
                />

                {/* Protected User Dashboard */}
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <UserDashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin"
                    element={<AdminDashboard />}
                />

                <Route
                    path="/admin/contestants"
                    element={<AdminContestants />}
                />

                <Route
                    path="/admin/shows"
                    element={<AdminShows />}
                />

                {/* Show Page */}
                <Route
                    path="/show/:showId"
                    element={
                        <ProtectedRoute>
                            <ShowPage />
                        </ProtectedRoute>
                    }
                />

                {/* Unknown Route */}
                <Route
                    path="*"
                    element={<Navigate to="/" replace />}
                />

            </Routes>
        </BrowserRouter>
    );
}

export default App;