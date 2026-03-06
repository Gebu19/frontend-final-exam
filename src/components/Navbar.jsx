// src/components/Navbar.jsx
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserProvider";

export default function Navbar() {
    const { user, logout } = useUser();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    if (!user.isLoggedIn) return null; // Don't show nav on login page

    return (
        <nav className="navbar">
            <div className="flex">
                <h2 style={{ margin: 0, marginRight: '20px', color: 'var(--primary)' }}>📚 LibrarySystem</h2>
                <Link to="/books">Books</Link>
                <Link to="/borrow">Requests</Link>
            </div>
            <div className="flex">
                <span style={{ color: 'var(--text-light)', fontSize: '14px' }}>
                    Logged in as <strong>{user.role}</strong>
                </span>
                <button onClick={handleLogout} className="btn btn-outline" style={{ padding: '6px 12px' }}>
                    Logout
                </button>
            </div>
        </nav>
    );
}
