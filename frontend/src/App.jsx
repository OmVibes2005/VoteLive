import {
    BrowserRouter,
    Routes,
    Route,
    Navigate,
    useNavigate
} from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";

import UserDashboard from "./pages/UserDashboard";
import MyVotes from "./pages/MyVotes";
import ShowPage from "./pages/ShowPage";

import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";

import AdminDashboard from "./pages/AdminDashboard";
import AdminShows from "./pages/AdminShows";
import AdminContestants from "./pages/AdminContestants";
import AdminVoting from "./pages/AdminVoting";
import AdminVoteManagement from "./pages/AdminVoteManagement";


import "./App.css";


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

                {/* Registration */}
                <Route
                    path="/register"
                    element={<Register />}
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

                {/* User Vote History */}
                <Route
                    path="/my-votes"
                    element={
                        <ProtectedRoute>
                            <MyVotes />
                        </ProtectedRoute>
                    }
                />


                {/* Admin Dashboard */}
                <Route
                    path="/admin"
                    element={
                        <AdminRoute>
                            <AdminDashboard />
                        </AdminRoute>
                    }
                />

                {/* Admin Contestants */}
                <Route
                    path="/admin/contestants"
                    element={
                        <AdminRoute>
                            <AdminContestants />
                        </AdminRoute>
                    }
                />

                {/* Admin Shows */}
                <Route
                    path="/admin/shows"
                    element={
                        <AdminRoute>
                            <AdminShows />
                        </AdminRoute>
                    }
                />

                {/* Admin Voting */}
                <Route
                    path="/admin/voting"
                    element={
                        <AdminRoute>
                            <AdminVoting />
                        </AdminRoute>
                    }
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

                {/* Admin Vote Management */}
                <Route
                    path="/admin/votes"
                    element={
                        <AdminRoute>
                            <AdminVoteManagement />
                        </AdminRoute>
                    }
                />

            </Routes>
        </BrowserRouter>
    );
}

export default App;