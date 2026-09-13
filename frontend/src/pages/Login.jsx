import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Login() {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);


    const handleLogin = async (event) => {

        event.preventDefault();

        setError("");
        setLoading(true);

        try {

            const response = await api.post(
                "/auth/login",
                {
                    email,
                    password,
                }
            );

            const token = response.data.token;
            const role = response.data.role;
            const name = response.data.name;

            localStorage.setItem("token", token);
            localStorage.setItem("role", role);
            localStorage.setItem("name", name);


            if (role === "ADMIN") {

                navigate("/admin");

            } else {

                navigate("/dashboard");

            }

        } catch (error) {

            setError(
                error.response?.data?.error ||
                "Login failed. Please check your credentials and try again."
            );

        } finally {

            setLoading(false);

        }
    };


    return (
        <div className="login-page">

            <div className="login-card">

                {/* =================================
                    BRAND
                ================================= */}

                <div className="auth-brand">

                    <div className="auth-brand-icon">
                        🗳️
                    </div>

                    <div>

                        <h1>
                            VoteLive
                        </h1>

                        <span>
                            REAL-TIME VOTING
                        </span>

                    </div>

                </div>


                {/* =================================
                    HEADER
                ================================= */}

                <div className="login-heading">

                    <h2>
                        Welcome back
                    </h2>

                    <p>
                        Sign in to continue to your VoteLive account.
                    </p>

                </div>


                {/* =================================
                    ERROR
                ================================= */}

                {error && (

                    <div className="login-error">

                        <span className="login-error-icon">
                            !
                        </span>

                        <div>

                            <strong>
                                Login unsuccessful
                            </strong>

                            <p>
                                {error}
                            </p>

                        </div>

                    </div>

                )}


                {/* =================================
                    FORM
                ================================= */}

                <form onSubmit={handleLogin}>

                    {/* EMAIL */}

                    <div className="form-group">

                        <label htmlFor="login-email">
                            Email Address
                        </label>

                        <div className="auth-input-wrapper">

                            <span className="auth-input-icon">
                                ✉
                            </span>

                            <input
                                id="login-email"
                                type="email"
                                value={email}
                                onChange={(event) =>
                                    setEmail(event.target.value)
                                }
                                placeholder="you@example.com"
                                autoComplete="email"
                                required
                            />

                        </div>

                    </div>


                    {/* PASSWORD */}

                    <div className="form-group">

                        <div className="password-label-row">

                            <label htmlFor="login-password">
                                Password
                            </label>

                        </div>

                        <div className="auth-input-wrapper">

                            <span className="auth-input-icon">
                                🔒
                            </span>

                            <input
                                id="login-password"
                                type={
                                    showPassword
                                        ? "text"
                                        : "password"
                                }
                                value={password}
                                onChange={(event) =>
                                    setPassword(event.target.value)
                                }
                                placeholder="Enter your password"
                                autoComplete="current-password"
                                required
                            />

                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() =>
                                    setShowPassword(
                                        !showPassword
                                    )
                                }
                                aria-label={
                                    showPassword
                                        ? "Hide password"
                                        : "Show password"
                                }
                            >
                                {showPassword ? "🙈" : "👁️"}
                            </button>

                        </div>

                    </div>


                    {/* LOGIN BUTTON */}

                    <button
                        type="submit"
                        className="login-submit-button"
                        disabled={loading}
                    >

                        {loading ? (
                            <>
                                <span className="button-spinner"></span>
                                Signing in...
                            </>
                        ) : (
                            <>
                                Sign In
                                <span className="button-arrow">
                                    →
                                </span>
                            </>
                        )}

                    </button>

                </form>


                {/* =================================
                    SECURITY NOTE
                ================================= */}

                <div className="auth-security-note">

                    <span>
                        🔐
                    </span>

                    <span>
                        Your account is protected with secure authentication.
                    </span>

                </div>


                {/* =================================
                    REGISTER
                ================================= */}

                <div className="register-link">

                    <span>
                        Don't have an account?
                    </span>

                    <button
                        type="button"
                        onClick={() =>
                            navigate("/register")
                        }
                    >
                        Create Account
                    </button>

                </div>

            </div>

        </div>
    );
}

export default Login;