
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiLogOut, FiGift } from 'react-icons/fi';

const Navbar = () => {
    const { user, signOut } = useAuth();

    return (
        <nav className="container navbar">
            <Link to="/" className="nav-brand">
                <span className="text-gradient" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FiGift /> Wishlist.io
                </span>
            </Link>

            {user ? (
                <div className="nav-user">
                    <Link to="/dashboard" style={{ color: 'inherit', textDecoration: 'none', fontWeight: 600 }}>My Lists</Link>
                    <img src={user.photoURL} alt={user.displayName} className="user-avatar" title={user.displayName} />
                    <button onClick={signOut} className="btn btn-outline" style={{ padding: '0.5rem' }}>
                        <FiLogOut />
                    </button>
                </div>
            ) : (
                <div>
                    {/* If not logged in, usually we show sign in, but that's on the landing page primarily */}
                    <a href="#login" className="btn btn-outline">Sign In</a>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
