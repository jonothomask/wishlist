
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FcGoogle } from 'react-icons/fc';

const LandingPage = () => {
    const [authMode, setAuthMode] = React.useState('google'); // google, email-signin, email-signup
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [error, setError] = React.useState('');

    const { user, signInWithGoogle, signInWithEmail, signUpWithEmail } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            navigate('/dashboard');
        }
    }, [user, navigate]);

    const handleGoogleLogin = async () => {
        try {
            setError('');
            await signInWithGoogle();
        } catch (error) {
            console.error("Login failed", error);
            setError('Google sign-in failed. Please try again.');
        }
    };

    const handleEmailAuth = async (e) => {
        e.preventDefault();
        setError('');
        try {
            if (authMode === 'email-signup') {
                await signUpWithEmail(email, password);
            } else {
                await signInWithEmail(email, password);
            }
        } catch (err) {
            console.error("Auth failed", err);
            // Improving error messages
            if (err.code === 'auth/wrong-password') setError('Incorrect password.');
            else if (err.code === 'auth/user-not-found') setError('No account found with this email.');
            else if (err.code === 'auth/email-already-in-use') setError('Email already in use.');
            else if (err.code === 'auth/weak-password') setError('Password should be at least 6 characters.');
            else setError(err.message || 'Authentication failed.');
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

                <div id="login" className="glass-card" style={{ padding: '3rem', display: 'inline-block', width: '100%', maxWidth: '400px' }}>
                    <h3 style={{ marginBottom: '1.5rem' }}>Get Started</h3>

                    {error && <div className="alert alert-danger" style={{ color: '#ef4444', marginBottom: '1rem', background: 'rgba(239, 68, 68, 0.1)', padding: '0.5rem', borderRadius: '4px' }}>{error}</div>}

                    {authMode === 'google' ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <button onClick={handleGoogleLogin} className="btn btn-primary" style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', margin: '0 auto', width: '100%' }}>
                                <FcGoogle style={{ background: 'white', borderRadius: '50%', padding: '2px' }} /> Continue with Google
                            </button>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: '#666' }}>
                                <hr style={{ flex: 1, borderColor: '#333' }} /> OR <hr style={{ flex: 1, borderColor: '#333' }} />
                            </div>
                            <button onClick={() => setAuthMode('email-signin')} className="btn btn-outline" style={{ width: '100%' }}>
                                Sign in with Email
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleEmailAuth} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', textAlign: 'left' }}>
                            <div>
                                <label style={{ fontSize: '0.9rem', marginBottom: '0.2rem', display: 'block', color: '#ccc' }}>Email</label>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    style={{ width: '100%' }}
                                />
                            </div>
                            <div>
                                <label style={{ fontSize: '0.9rem', marginBottom: '0.2rem', display: 'block', color: '#ccc' }}>Password</label>
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    style={{ width: '100%' }}
                                />
                            </div>

                            <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem' }}>
                                {authMode === 'email-signup' ? 'Create Account' : 'Sign In'}
                            </button>

                            <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.9rem' }}>
                                {authMode === 'email-signin' ? (
                                    <>
                                        Don't have an account? <a href="#" onClick={(e) => { e.preventDefault(); setAuthMode('email-signup'); setError(''); }} style={{ color: 'var(--color-secondary)' }}>Sign Up</a>
                                    </>
                                ) : (
                                    <>
                                        Already have an account? <a href="#" onClick={(e) => { e.preventDefault(); setAuthMode('email-signin'); setError(''); }} style={{ color: 'var(--color-secondary)' }}>Sign In</a>
                                    </>
                                )}
                            </div>
                            <div style={{ textAlign: 'center', marginTop: '0.5rem', fontSize: '0.9rem' }}>
                                <a href="#" onClick={(e) => { e.preventDefault(); setAuthMode('google'); setError(''); }} className="text-muted">Back to verified options</a>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
