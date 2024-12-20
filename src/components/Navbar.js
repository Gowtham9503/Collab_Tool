import './Navbar.css';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;
    const [isOpen, setIsOpen] = useState(false);

    const handleLogout = () => {
        // Remove user data from local storage
        localStorage.removeItem('user');
        // Redirect to landing page
        navigate('/');
    };

    const toggleNavbar = () => {
        setIsOpen(!isOpen);
    };

    return (
        <nav className="navbar">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/">CollabTool</Link>
                <button className="navbar-toggler" type="button" onClick={toggleNavbar}>
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className={`collapse navbar-collapse ${isOpen ? 'show' : ''}`} id="navbarNav">
                    <ul className="navbar-nav me-auto">
                        <li className="nav-item">
                            <Link className="nav-link" to="/dashboard">Dashboard</Link>
                        </li>
                    </ul>
                    {user ? (
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <button className="btn btn-link nav-link" onClick={handleLogout}>{user.username} Logout</button>
                            </li>
                        </ul>
                    ) : (
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <Link className="nav-link" to="/login">Login</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/register">Register</Link>
                            </li>
                        </ul>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
