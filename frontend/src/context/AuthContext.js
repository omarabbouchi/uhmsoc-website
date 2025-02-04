import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        setIsLoggedIn(!!token);
    }, []);

    const login = (token) => {
        localStorage.setItem('adminToken', token);
        setIsLoggedIn(true);
    };

    const logout = () => {
        localStorage.removeItem('adminToken');
        setIsLoggedIn(false);
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext); 