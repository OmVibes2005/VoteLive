import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Register.css";

function Register() {

    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);


    const handleRegister = async (event) => {

        event.preventDefault();

        setError("");
        setMessage("");


        if (password !== confirmPassword) {

            setError("Passwords do not match.");

            return;
        }


        if (password.length < 6) {

            setError(
                "Password must contain at least 6 characters."
            );

            return;
        }


        try {

            setLoading(true);

            const response =
                await api.post(
                    "/auth/register",
                    {
                        name,
                        email,
                        password
                    }
                );


            setMessage(
                response.data.message ||
                "Account created successfully."
            );


            setName("");
            setEmail("");
            setPassword("");
            setConfirmPassword("");


            setTimeout(() => {

                navigate("/login");

            }, 1200);


        } catch (error) {

            setError(
                error.response?.data?.error ||
                "Unable to create account. Please try again."
            );

        } finally {

            setLoading(false);
        }
    };


    return (

        <div className="register-page">

            <div className="register-card">


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

                <div className="register-header">

                    <h2>
                        Create your account
                    </h2>

                    <p>
                        Join VoteLive and start voting for your favorite contestants.
                    </p>

                </div>


                {/* =================================
                    SUCCESS MESSAGE
                ================================= */}

                {message && (

                    <div className="register-success">

                        <span className="register-success-icon">
                            ✓
                        </span>

                        <div>

                            <strong>
                                Account created
                            </strong>

                            <p>
                                {message}
                            </p>

                        </div>

                    </div>

                )}


                {/* =================================
                    ERROR MESSAGE
                ================================= */}

                {error && (

                    <div className="login-error">

                        <span className="login-error-icon">
                            !
                        </span>

                        <div>

                            <strong>
                                Registration unsuccessful
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

                <form onSubmit={handleRegister}>


                    {/* NAME */}

                    <div className="form-group">

                        <label htmlFor="register-name">
                            Full Name
                        </label>

                        <div className="auth-input-wrapper">

                            <span className="auth-input-icon">
                                👤
                            </span>

                            <input
                                id="register-name"
                                type="text"
                                value={name}
                                onChange={(event) =>
                                    setName(
                                        event.target.value
                                    )
                                }
                                placeholder="Enter your full name"
                                autoComplete="name"
                                required
                            />

                        </div>

                    </div>


                    {/* EMAIL */}

                    <div className="form-group">

                        <label htmlFor="register-email">
                            Email Address
                        </label>

                        <div className="auth-input-wrapper">

                            <span className="auth-input-icon">
                                ✉
                            </span>

                            <input
                                id="register-email"
                                type="email"
                                value={email}
                                onChange={(event) =>
                                    setEmail(
                                        event.target.value
                                    )
                                }
                                placeholder="you@example.com"
                                autoComplete="email"
                                required
                            />

                        </div>

                    </div>


                    {/* PASSWORD */}

                    <div className="form-group">

                        <label htmlFor="register-password">
                            Password
                        </label>

                        <div className="auth-input-wrapper">

                            <span className="auth-input-icon">
                                🔒
                            </span>

                            <input
                                id="register-password"
                                type={
                                    showPassword
                                        ? "text"
                                        : "password"
                                }
                                value={password}
                                onChange={(event) =>
                                    setPassword(
                                        event.target.value
                                    )
                                }
                                placeholder="Create a password"
                                autoComplete="new-password"
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
                                {showPassword
                                    ? "🙈"
                                    : "👁️"}
                            </button>

                        </div>

                        <div className="password-hint">
                            Minimum 6 characters
                        </div>

                    </div>


                    {/* CONFIRM PASSWORD */}

                    <div className="form-group">

                        <label htmlFor="register-confirm-password">
                            Confirm Password
                        </label>

                        <div className="auth-input-wrapper">

                            <span className="auth-input-icon">
                                🔐
                            </span>

                            <input
                                id="register-confirm-password"
                                type={
                                    showConfirmPassword
                                        ? "text"
                                        : "password"
                                }
                                value={confirmPassword}
                                onChange={(event) =>
                                    setConfirmPassword(
                                        event.target.value
                                    )
                                }
                                placeholder="Confirm your password"
                                autoComplete="new-password"
                                required
                            />

                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() =>
                                    setShowConfirmPassword(
                                        !showConfirmPassword
                                    )
                                }
                                aria-label={
                                    showConfirmPassword
                                        ? "Hide password"
                                        : "Show password"
                                }
                            >
                                {showConfirmPassword
                                    ? "🙈"
                                    : "👁️"}
                            </button>

                        </div>

                    </div>


                    {/* SUBMIT */}

                    <button
                        type="submit"
                        className="register-submit-button"
                        disabled={loading}
                    >

                        {loading ? (
                            <>
                                <span className="button-spinner"></span>
                                Creating Account...
                            </>
                        ) : (
                            <>
                                Create Account
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
                        Your password is securely protected.
                    </span>

                </div>


                {/* =================================
                    LOGIN LINK
                ================================= */}

                <div className="register-login-link">

                    <span>
                        Already have an account?
                    </span>

                    <button
                        type="button"
                        onClick={() =>
                            navigate("/login")
                        }
                    >
                        Sign In
                    </button>

                </div>

            </div>

        </div>
    );
}

export default Register;