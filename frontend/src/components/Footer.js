import React from 'react';

const Footer = () => {
    return (
        <footer style={{
            background: '#6366f1',
            color: 'white',
            padding: '1rem',
            textAlign: 'center',
            position: 'fixed',
            bottom: 0,
            width: '100%',
            boxShadow: '0 -2px 4px rgba(0, 0, 0, 0.1)',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            fontSize: '0.875rem',
            letterSpacing: '0.025em',
        }}>
            Made by <span style={{ fontWeight: '600' }}>Mahin Hussain</span><br></br> IIT KGP
        </footer>
    );
};

export default Footer;