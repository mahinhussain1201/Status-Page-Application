import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { logout, user } = useAuth();

    const handleLogout = () => {
        try {
            logout();
            navigate('/login');
        } catch (error) {
            console.error('Logout failed:', error);
            navigate('/login');
        }
    };

    const isActive = (path) => {
        return location.pathname === path
            ? 'bg-white text-gray-800 shadow-md'
            : 'text-white hover:bg-white hover:text-gray-800 hover:shadow';
    };

    return (
        <nav style={{
            background: '#6366f1',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            position: 'sticky',
            top: 0,
            zIndex: 1000,
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                padding: '0 1.5rem',
                height: '4rem'
            }}>
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center space-x-6">
                        <Link to="/dashboard" style={{
                            fontSize: '1.5rem',
                            fontWeight: '700',
                            color: 'white',
                            textDecoration: 'none',
                            letterSpacing: '0.05em',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                        }}>
                            🚨 StatusBoard
                        </Link>
                        <div className="hidden md:flex space-x-4"
                        style={{
                            display: 'flex',
                            gap: '1rem', 
                            alignItems: 'center',
                            flexWrap: 'nowrap' 
                        }}>
                            <Link
                                to="/dashboard/incidents"
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition duration-200 ease-in-out ${isActive('/dashboard/incidents')}`}
                                style={{
                                    backgroundColor: 'white',
                                    color: '#6366f1',
                                    padding: '0.5rem 0.75rem',
                                    borderRadius: '0.375rem',
                                    fontSize: '0.875rem',
                                    fontWeight: '600',
                                    transition: 'all 0.2s ease-in-out',
                                    border: 'none',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.25rem',
                                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                                    width: 'fit-content'
                                }}
                            >
                                🔔 Incidents
                            </Link>
                            <Link
                                to="/dashboard/services"
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition duration-200 ease-in-out ${isActive('/dashboard/services')}`}
                                style={{
                                    backgroundColor: 'white',
                                    color: '#6366f1',
                                    padding: '0.5rem 0.75rem',
                                    borderRadius: '0.375rem',
                                    fontSize: '0.875rem',
                                    fontWeight: '600',
                                    transition: 'all 0.2s ease-in-out',
                                    border: 'none',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.25rem',
                                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                                    width: 'fit-content'
                                }}
                            >
                                ⚙️ Services
                            </Link>
                            <Link
                                to="/dashboard/teams"
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition duration-200 ease-in-out ${isActive('/dashboard/teams')}`}
                                style={{
                                    backgroundColor: 'white',
                                    color: '#6366f1',
                                    padding: '0.5rem 0.75rem',
                                    borderRadius: '0.375rem',
                                    fontSize: '0.875rem',
                                    fontWeight: '600',
                                    transition: 'all 0.2s ease-in-out',
                                    border: 'none',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.25rem',
                                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                                    width: 'fit-content'
                                }}
                            >
                                👥 Teams
                            </Link>
                        </div>
                    </div>
                    <div style={{
                            position: 'absolute', // or 'fixed' if you want it to stay while scrolling
                            top: '1rem',
                            right: '1rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            zIndex: 1000
                        }}>
                        {user && (
                            <>
                                <span style={{
                                    backgroundColor: 'white',
                                    fontSize: '0.875rem',
                                    color: 'white',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.25rem',
                                    color:'#6366f1',
                                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                                    fontWeight: '600',
                                    transition: 'all 0.2s ease-in-out',
                                    border: 'none',
                                    gap: '0.25rem',
                                    padding: '0.5rem 0.75rem',
                                    borderRadius: '0.375rem',
                                }}>
                                    👤 {user.username}
                                </span>
                                <button
                                    onClick={handleLogout}
                                    style={{
                                        backgroundColor: '#ef4444',
                                        color: 'white',
                                        padding: '0.5rem 0.75rem',
                                        borderRadius: '0.375rem',
                                        fontSize: '0.875rem',
                                        fontWeight: '600',
                                        transition: 'all 0.2s ease-in-out',
                                        border: 'none',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.25rem',
                                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                                    }}
                                    onMouseOver={(e) => {
                                        e.currentTarget.style.backgroundColor = '#dc2626';
                                        e.currentTarget.style.transform = 'translateY(-1px)';
                                    }}
                                    onMouseOut={(e) => {
                                        e.currentTarget.style.backgroundColor = '#ef4444';
                                        e.currentTarget.style.transform = 'translateY(0)';
                                    }}
                                >
                                    🚪 Logout
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;