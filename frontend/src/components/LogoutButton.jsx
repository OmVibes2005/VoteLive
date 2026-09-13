import { useNavigate } from "react-router-dom";

function LogoutButton() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("name");

        navigate("/login", { replace: true });
    };

    return (
        <button
            type="button"
            onClick={handleLogout}
            className="logout-button"
        >
            Logout
        </button>
    );
}

export default LogoutButton;