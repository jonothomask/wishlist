
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FcGoogle } from 'react-icons/fc';

const LandingPage = () => {
    const { user, signInWithGoogle } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            navigate('/dashboard');
        }
    }, [user, navigate]);

    const handleLogin = async () => {
        try {
            await signInWithGoogle();
            // AuthContext listener will handle the redirect via the effect above or local state change
        } catch (error) {
            console.error("Login failed", error);
        }
    };

    return (
        <div className="container animate-fade-in" style={{ textAlign: 'center', padding: '4rem 0' }}>
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                <h1 style={{ marginBottom: '1.5rem' }}>
                    Create & Share Your <br />
                    <span className="text-gradient">Dream Wishlist</span>
                </h1>
                <p className="text-muted" style={{ fontSize: '1.25rem', marginBottom: '3rem', lineHeight: '1.6' }}>
                    The most beautiful way to organize your gift ideas.
                    Link items from any store, organize by occasion, and share with friends and family seamlessly.
                </p>

                <div id="login" className="glass-card" style={{ padding: '3rem', display: 'inline-block' }}>
                    <h3 style={{ marginBottom: '1.5rem' }}>Get Started</h3>
                    <button onClick={handleLogin} className="btn btn-primary" style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '8px', margin: '0 auto' }}>
                        <FcGoogle style={{ background: 'white', borderRadius: '50%', padding: '2px' }} /> Continue with Google
                    </button>

                </div>
            </div>
        </div>
    );
};

export default LandingPage;
