import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const userData = JSON.parse(localStorage.getItem('user'));
            setUser(userData);
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const response = await axios.post('https://status-page-application-1-fy4x.onrender.com/api/auth/login', {
                email,
                password
            });
            
            const { token, user } = response.data;
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            setUser(user);
            
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            
            return user;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Login failed');
        }
    };

    const register = async (userData) => {
        try {
            const response = await axios.post('https://status-page-application-1-fy4x.onrender.com/api/auth/register', userData);
            const { token, user } = response.data;
            
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            setUser(user);
            
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            
            return user;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Registration failed');
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        delete axios.defaults.headers.common['Authorization'];
        setUser(null);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <AuthContext.Provider value={{ user, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export default AuthContext;
