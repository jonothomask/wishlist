
import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { store } from '../services/store';
import { FiPlus, FiCalendar, FiArrowRight } from 'react-icons/fi';

const Dashboard = () => {
    const { user } = useAuth();
    const [lists, setLists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreate, setShowCreate] = useState(false);
    const [newTitle, setNewTitle] = useState('');

    useEffect(() => {
        loadLists();
    }, [user]);

    const loadLists = async () => {
        if (!user) return;
        try {
            const data = await store.getUserWishlists(user.uid);
            setLists(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        if (!newTitle.trim()) return;
        try {
            await store.createWishlist(user.uid, newTitle, '');
            setNewTitle('');
            setShowCreate(false);
            loadLists();
        } catch (e) {
            console.error(e);
        }
    };

    if (loading) return <div className="loading-screen">Loading...</div>;

    return (
        <div className="container animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2>My Wishlists</h2>
                <button onClick={() => setShowCreate(!showCreate)} className="btn btn-primary">
                    <FiPlus /> New List
                </button>
            </div>

            {showCreate && (
                <div className="glass-card animate-fade-in" style={{ padding: '2rem', marginBottom: '2rem', maxWidth: '500px' }}>
                    <form onSubmit={handleCreate}>
                        <h3 style={{ marginTop: 0 }}>Create New Wishlist</h3>
                        <div style={{ marginBottom: '1rem' }}>
                            <input
                                autoFocus
                                type="text"
                                placeholder="e.g. Birthday 2024, Baby Shower..."
                                value={newTitle}
                                onChange={(e) => setNewTitle(e.target.value)}
                            />
                        </div>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button type="submit" className="btn btn-primary">Create</button>
                            <button type="button" onClick={() => setShowCreate(false)} className="btn btn-outline">Cancel</button>
                        </div>
                    </form>
                </div>
            )}

            {lists.length === 0 && !showCreate ? (
                <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--color-text-muted)' }}>
                    <p>You haven't created any wishlists yet.</p>
                    <button onClick={() => setShowCreate(true)} className="btn btn-primary" style={{ marginTop: '1rem' }}>
                        Create Your First List
                    </button>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3">
                    {lists.map(list => (
                        <Link to={`/wishlist/${list.id}`} key={list.id} style={{ textDecoration: 'none', color: 'inherit' }}>
                            <div className="glass-card" style={{ padding: '1.5rem', height: '100%', transition: 'all 0.2s', display: 'flex', flexDirection: 'column' }}>
                                <h3 className="text-gradient" style={{ marginBottom: '0.5rem' }}>{list.title}</h3>
                                <p className="text-muted" style={{ fontSize: '0.9rem', marginBottom: 'auto' }}>
                                    {list.items.length} items
                                </p>
                                <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                                    <span><FiCalendar style={{ marginRight: '4px', verticalAlign: 'text-bottom' }} /> {new Date(list.createdAt).toLocaleDateString()}</span>
                                    <FiArrowRight />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Dashboard;
