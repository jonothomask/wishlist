
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { store } from '../services/store';
import { FiExternalLink, FiGift } from 'react-icons/fi';

const PublicWishlistView = () => {
    const { id } = useParams();
    const [list, setList] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadList();
    }, [id]);

    const loadList = async () => {
        try {
            const data = await store.getWishlist(id);
            setList(data);
        } catch (e) {
            setError('Wishlist not found or private.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="loading-screen">Loading...</div>;
    if (error) return (
        <div className="container" style={{ textAlign: 'center', padding: '4rem' }}>
            <h2>{error}</h2>
            <Link to="/" className="btn btn-primary" style={{ marginTop: '1rem' }}>Go Home</Link>
        </div>
    );

    return (
        <div className="container animate-fade-in" style={{ paddingBottom: '4rem' }}>
            <div style={{ padding: '2rem 0', textAlign: 'center' }}>
                <Link to="/" style={{ textDecoration: 'none', color: 'var(--color-primary)', fontWeight: 'bold', display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '2rem' }}>
                    <FiGift /> Wishlist.io
                </Link>
                <h1 className="text-gradient" style={{ marginBottom: '0.5rem' }}>{list.title}</h1>
                <p className="text-muted">{list.description}</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3">
                {list.items.length === 0 && (
                    <div style={{ gridColumn: '1/-1', textAlign: 'center', color: 'var(--color-text-muted)', padding: '2rem' }}>
                        This wishlist is empty!
                    </div>
                )}
                {list.items.map(item => (
                    <div key={item.id} className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
                        <h3 style={{ marginBottom: '0.5rem' }}>{item.name}</h3>
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
        </div>
    );
};

export default PublicWishlistView;
