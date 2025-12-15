
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { store } from '../services/store';
import { FiArrowLeft, FiPlus, FiTrash2, FiShare2, FiExternalLink, FiCopy, FiCheck, FiEdit2 } from 'react-icons/fi';

const WishlistDetail = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [list, setList] = useState(null);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    // Item Modal State
    const [isItemModalOpen, setIsItemModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null); // If set, we are editing this item
    const [itemForm, setItemForm] = useState({ name: '', url: '', price: '', notes: '' });

    // List Edit State
    const [isListModalOpen, setIsListModalOpen] = useState(false);
    const [listForm, setListForm] = useState({ title: '', description: '' });

    // Share State
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        loadList();
    }, [id, user]);

    const loadList = async () => {
        try {
            const data = await store.getWishlist(id);
            if (data.userId !== user.uid) {
                // Not authorized, redirect to dashboard
                navigate('/dashboard');
                return;
            }
            setList(data);
            setItems(data.items || []);
            setListForm({ title: data.title, description: data.description || '' });
        } catch (e) {
            console.error(e);
            navigate('/dashboard');
        } finally {
            setLoading(false);
        }
    };

    // --- ITEM HANDLERS ---

    const openAddItem = () => {
        setEditingItem(null);
        setItemForm({ name: '', url: '', price: '', notes: '' });
        setIsItemModalOpen(true);
    };

    const openEditItem = (item) => {
        setEditingItem(item);
        setItemForm({
            name: item.name,
            url: item.url || '',
            price: item.price || '',
            notes: item.notes || ''
        });
        setIsItemModalOpen(true);
    };

    const fetchPreview = async (url) => {
        if (!url) return null;
        try {
            // Using Microlink API for free link previews
            const response = await fetch(`https://api.microlink.io?url=${encodeURIComponent(url)}&palette=true&audio=false&video=false&iframe=false`);
            const data = await response.json();
            if (data.status === 'success' && data.data.image) {
                return data.data.image.url;
            }
        } catch (e) {
            console.warn("Failed to fetch link preview", e);
        }
        return null;
    };

    const handleSaveItem = async (e) => {
        e.preventDefault();
        if (!itemForm.name) return;

        try {
            // Fetch preview if URL is changing or adding new
            let previewImage = editingItem ? editingItem.image : null;

            // Only fetch if URL is present and (it's new OR it changed)
            if (itemForm.url && (!editingItem || editingItem.url !== itemForm.url)) {
                const img = await fetchPreview(itemForm.url);
                if (img) previewImage = img;
            }

            const itemData = {
                ...itemForm,
                image: previewImage || null
            };

            if (editingItem) {
                // Update existing
                await store.updateItem(id, editingItem.id, itemData);
                setItems(items.map(i => i.id === editingItem.id ? { ...i, ...itemData } : i));
            } else {
                // Add new
                const added = await store.addItem(id, itemData);
                setItems([...items, added]);
            }
            setIsItemModalOpen(false);
        } catch (e) {
            console.error(e);
            alert('Error saving item');
        }
    };

    const handleDeleteItem = async (itemId) => {
        if (!confirm('Remove this item?')) return;
        try {
            await store.deleteItem(id, itemId);
            setItems(items.filter(i => i.id !== itemId));
        } catch (e) { console.error(e); }
    };

    // --- LIST HANDLERS ---

    const handleSaveList = async (e) => {
        e.preventDefault();
        if (!listForm.title) return;
        try {
            await store.updateWishlist(id, listForm);
            setList({ ...list, ...listForm });
            setIsListModalOpen(false);
        } catch (e) {
            console.error(e);
            alert('Error updating wishlist');
        }
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
                    <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                            <h1 style={{ fontSize: '2.5rem', margin: 0 }} className="text-gradient">{list.title}</h1>
                            <button onClick={() => setIsListModalOpen(true)} className="btn btn-sm btn-outline" style={{ fontSize: '0.8rem', padding: '0.2rem 0.5rem' }}>Edit Info</button>
                        </div>
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
                    onClick={openAddItem}
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
                    <div key={item.id} className="glass-card" style={{ padding: '0', position: 'relative', overflow: 'hidden' }}>
                        {item.image && (
                            <div style={{ width: '100%', height: '180px', background: '#000', overflow: 'hidden' }}>
                                <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                        )}
                        <div style={{ padding: '1.5rem' }}>
                            <div style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', display: 'flex', gap: '0.5rem', zIndex: 10 }}>
                                <button
                                    onClick={() => openEditItem(item)}
                                    style={{ background: 'rgba(0,0,0,0.6)', border: 'none', color: 'white', cursor: 'pointer', borderRadius: '50%', padding: '0.4rem', display: 'flex' }}
                                    title="Edit Item"
                                >
                                    <FiEdit2 size={14} />
                                </button>
                                <button
                                    onClick={() => handleDeleteItem(item.id)}
                                    style={{ background: 'rgba(0,0,0,0.6)', border: 'none', color: '#ff6b6b', cursor: 'pointer', borderRadius: '50%', padding: '0.4rem', display: 'flex' }}
                                    title="Delete Item"
                                >
                                    <FiTrash2 size={14} />
                                </button>
                            </div>

                            <h3 style={{ marginBottom: '0.5rem', fontSize: '1.25rem' }}>{item.name}</h3>
                            {item.price && <div style={{ color: 'var(--color-secondary)', fontWeight: 'bold', marginBottom: '0.5rem' }}>{item.price}</div>}
                            {item.notes && <p className="text-muted" style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>{item.notes}</p>}

                            {item.url && (
                                <a href={item.url} target="_blank" rel="noopener noreferrer" className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', marginTop: '1rem' }}>
                                    View Item <FiExternalLink style={{ marginLeft: '0.5rem' }} />
                                </a>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Item Modal (Add/Edit) */}
            {isItemModalOpen && (
                <div className="modal-overlay" style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem'
                }}>
                    <div className="glass-card animate-fade-in" style={{ width: '100%', maxWidth: '500px', padding: '2rem', background: '#1e293b' }}>
                        <h2 style={{ marginTop: 0 }}>{editingItem ? 'Edit Item' : 'Add Item'}</h2>
                        <form onSubmit={handleSaveItem} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                                <label className="text-muted" style={{ fontSize: '0.85rem' }}>Item Name *</label>
                                <input type="text" required value={itemForm.name} onChange={e => setItemForm({ ...itemForm, name: e.target.value })} placeholder="e.g. Graphic T-Shirt" />
                            </div>
                            <div>
                                <label className="text-muted" style={{ fontSize: '0.85rem' }}>Link (Optional)</label>
                                <input type="url" value={itemForm.url} onChange={e => setItemForm({ ...itemForm, url: e.target.value })} placeholder="https://amazon.com/..." />
                            </div>
                            <div>
                                <label className="text-muted" style={{ fontSize: '0.85rem' }}>Price (Optional)</label>
                                <input type="text" value={itemForm.price} onChange={e => setItemForm({ ...itemForm, price: e.target.value })} placeholder="$25.00" />
                            </div>
                            <div>
                                <label className="text-muted" style={{ fontSize: '0.85rem' }}>Notes </label>
                                <textarea rows={3} value={itemForm.notes} onChange={e => setItemForm({ ...itemForm, notes: e.target.value })} placeholder="Size, Color, etc." />
                            </div>
                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>{editingItem ? 'Save Changes' : 'Add Item'}</button>
                                <button type="button" onClick={() => setIsItemModalOpen(false)} className="btn btn-outline" style={{ flex: 1 }}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* List Edit Modal */}
            {isListModalOpen && (
                <div className="modal-overlay" style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem'
                }}>
                    <div className="glass-card animate-fade-in" style={{ width: '100%', maxWidth: '500px', padding: '2rem', background: '#1e293b' }}>
                        <h2 style={{ marginTop: 0 }}>Edit Wishlist</h2>
                        <form onSubmit={handleSaveList} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                                <label className="text-muted" style={{ fontSize: '0.85rem' }}>Title *</label>
                                <input type="text" required value={listForm.title} onChange={e => setListForm({ ...listForm, title: e.target.value })} placeholder="e.g. Birthday Wishlist" />
                            </div>
                            <div>
                                <label className="text-muted" style={{ fontSize: '0.85rem' }}>Description</label>
                                <textarea rows={3} value={listForm.description} onChange={e => setListForm({ ...listForm, description: e.target.value })} placeholder="What is this list for?" />
                            </div>
                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Save Changes</button>
                                <button type="button" onClick={() => setIsListModalOpen(false)} className="btn btn-outline" style={{ flex: 1 }}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
};


export default WishlistDetail;
