
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { store } from '../services/store';
import { FiArrowLeft, FiPlus, FiTrash2, FiShare2, FiExternalLink, FiCopy, FiCheck } from 'react-icons/fi';

const WishlistDetail = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [list, setList] = useState(null);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newItem, setNewItem] = useState({ name: '', url: '', price: '', notes: '' });

    // Share State
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        loadList();
    }, [id, user]);

    const loadList = async () => {
        try {
            const data = await store.getWishlist(id);
            if (data.userId !== user.uid) {
                // Not authorized, maybe redirect to public view? 
                // For now, redirect to dashboard if not owner
                navigate('/dashboard');
                return;
            }
            setList(data);
            setItems(data.items || []);
        } catch (e) {
            console.error(e);
            navigate('/dashboard');
        } finally {
            setLoading(false);
        }
    };

    const handleAddItem = async (e) => {
        e.preventDefault();
        if (!newItem.name) return;
        try {
            const added = await store.addItem(id, newItem);
            setItems([...items, added]);
            setNewItem({ name: '', url: '', price: '', notes: '' });
            setIsModalOpen(false);
        } catch (e) {
            console.error(e);
        }
    };

    const handleDeleteItem = async (itemId) => {
        if (!confirm('Remove this item?')) return;
        try {
            await store.deleteItem(id, itemId);
            setItems(items.filter(i => i.id !== itemId));
        } catch (e) { console.error(e); }
    };

    const handleDeleteList = async () => {
        if (!confirm('Delete this entire wishlist? This cannot be undone.')) return;
        try {
            await store.deleteWishlist(id);
            navigate('/dashboard');
        } catch (e) { console.error(e); }
    }

    const copyShareLink = () => {
        const url = `${window.location.origin}/shared/${id}`;
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (loading) return <div className="loading-screen">Loading...</div>;
    if (!list) return null;

    return (
        <div className="container animate-fade-in" style={{ paddingBottom: '4rem' }}>
            <button onClick={() => navigate('/dashboard')} className="btn btn-outline" style={{ marginBottom: '1rem', border: 'none', paddingLeft: 0 }}>
                <FiArrowLeft /> Back to Dashboard
            </button>

            {/* Header */}
            <div className="glass-card" style={{ padding: '2rem', marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }} className="text-gradient">{list.title}</h1>
                        <p className="text-muted">{list.description || 'No description provided.'}</p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button onClick={copyShareLink} className="btn btn-primary">
                            {copied ? <FiCheck /> : <FiShare2 />} {copied ? 'Copied Link' : 'Share'}
                        </button>
                        <button onClick={handleDeleteList} className="btn btn-danger">
                            <FiTrash2 />
                        </button>
                    </div>
                </div>
            </div>

            {/* Items Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3">

                {/* Add New Card */}
                <div
                    onClick={() => setIsModalOpen(true)}
                    className="glass-card"
                    style={{
                        minHeight: '200px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        borderStyle: 'dashed',
                        opacity: 0.7
                    }}
                >
                    <FiPlus size={48} className="text-gradient" />
                    <p style={{ marginTop: '1rem', fontWeight: 600 }}>Add New Item</p>
                </div>

                {items.map(item => (
                    <div key={item.id} className="glass-card" style={{ padding: '1.5rem', position: 'relative' }}>
                        <button
                            onClick={() => handleDeleteItem(item.id)}
                            style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                        >
                            <FiTrash2 />
                        </button>

                        <h3 style={{ paddingRight: '2rem', marginBottom: '0.5rem' }}>{item.name}</h3>
                        {item.price && <div style={{ color: 'var(--color-secondary)', fontWeight: 'bold', marginBottom: '0.5rem' }}>{item.price}</div>}
                        {item.notes && <p className="text-muted" style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>{item.notes}</p>}

                        {item.url && (
                            <a href={item.url} target="_blank" rel="noopener noreferrer" className="btn btn-outline" style={{ marginTop: 'auto', width: '100%' }}>
                                View Item <FiExternalLink style={{ marginLeft: 'auto' }} />
                            </a>
                        )}
                    </div>
                ))}
            </div>

            {/* Add Item Modal */}
            {isModalOpen && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem'
                }}>
                    <div className="glass-card animate-fade-in" style={{ width: '100%', maxWidth: '500px', padding: '2rem', background: '#1e293b' }}>
                        <h2 style={{ marginTop: 0 }}>Add Item</h2>
                        <form onSubmit={handleAddItem} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                                <label className="text-muted" style={{ fontSize: '0.85rem' }}>Item Name *</label>
                                <input text="text" required value={newItem.name} onChange={e => setNewItem({ ...newItem, name: e.target.value })} placeholder="e.g. Graphic T-Shirt" />
                            </div>
                            <div>
                                <label className="text-muted" style={{ fontSize: '0.85rem' }}>Link (Optional)</label>
                                <input text="url" value={newItem.url} onChange={e => setNewItem({ ...newItem, url: e.target.value })} placeholder="https://amazon.com/..." />
                            </div>
                            <div>
                                <label className="text-muted" style={{ fontSize: '0.85rem' }}>Price (Optional)</label>
                                <input text="text" value={newItem.price} onChange={e => setNewItem({ ...newItem, price: e.target.value })} placeholder="$25.00" />
                            </div>
                            <div>
                                <label className="text-muted" style={{ fontSize: '0.85rem' }}>Notes </label>
                                <textarea rows={3} value={newItem.notes} onChange={e => setNewItem({ ...newItem, notes: e.target.value })} placeholder="Size, Color, etc." />
                            </div>
                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Add Item</button>
                                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-outline" style={{ flex: 1 }}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
};

export default WishlistDetail;
