
import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../services/auth';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setUser(user);
            setLoading(false);
        });
        return unsubscribe;
    }, []);

    const value = {
        user,
        loading,
        signInWithGoogle: auth.signInWithGoogle,
        signOut: auth.signOut,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
