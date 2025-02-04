import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
    const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const checkLoginStatus = () => {
            const token = localStorage.getItem('adminToken');
            console.log('Current token:', token); // Debug log
            setIsAdminLoggedIn(!!token);
        };

        checkLoginStatus();
        //check login status whenever the component mounts or updates
        window.addEventListener('storage', checkLoginStatus);
        
        //also check periodically (every 30 seconds)
        const interval = setInterval(checkLoginStatus, 30000);
        
        return () => {
            window.removeEventListener('storage', checkLoginStatus);
            clearInterval(interval);
        };
    }, []);

    const handleLogout = () => {
        console.log('Logging out...');
        localStorage.removeItem('adminToken');
        setIsAdminLoggedIn(false);
        navigate('/');
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-custom">
            <div className="container">
                <Link className="navbar-brand" to="/">
                    <img 
                        src="/images/uh-logo.png"
                        alt="UH Soccer" 
                        height="40" 
                        className="me-2" 
                    />
                    <span>UH Men's Soccer</span>
                </Link>
                
                {/* Hamburger button */}
                <button 
                    className="navbar-toggler collapsed"
                    type="button" 
                    data-bs-toggle="collapse" 
                    data-bs-target="#navbarNavDropdown" 
                    aria-controls="navbarNavDropdown" 
                    aria-expanded="false" 
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                {/* Collapsible content */}
                <div className="collapse navbar-collapse" id="navbarNavDropdown">
                    <ul className="navbar-nav me-auto">
                        <li className="nav-item">
                            <Link className="nav-link" to="/roster">Roster</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/schedule">Schedule</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/about">About</Link>
                        </li>
                    </ul>
                    <ul className="navbar-nav">
                        {isAdminLoggedIn ? (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/admin/dashboard">Dashboard</Link>
                                </li>
                                <li className="nav-item">
                                    <button 
                                        className="nav-link btn btn-link" 
                                        onClick={handleLogout}
                                    >
                                        Logout
                                    </button>
                                </li>
                            </>
                        ) : (
                            <li className="nav-item">
                                <Link className="nav-link login-btn" to="/admin/login">Admin Login</Link>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar; 