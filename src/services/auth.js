
// Mock Authentication Service
// Simulates Firebase Auth behavior so the app works without backend/API keys initially.

const MOCK_DELAY = 800;
const STORAGE_KEY = 'wishlist_mock_user';

export const auth = {
    // Simulate Google Sign In
    signInWithGoogle: async () => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const mockUser = {
                    uid: 'mock-user-' + Math.random().toString(36).substr(2, 9),
                    displayName: 'Demo User',
                    email: 'demo@example.com',
                    photoURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
                };
                localStorage.setItem(STORAGE_KEY, JSON.stringify(mockUser));
                notifyListeners(mockUser);
                resolve(mockUser);
            }, MOCK_DELAY);
        });
    },

    // Sign out
    signOut: async () => {
        return new Promise((resolve) => {
            setTimeout(() => {
                localStorage.removeItem(STORAGE_KEY);
                notifyListeners(null);
                resolve();
            }, MOCK_DELAY / 2);
        });
    },

    // Auth State Listener
    onAuthStateChanged: (callback) => {
        listeners.push(callback);
        // Determine initial state
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            callback(JSON.parse(stored));
        } else {
            callback(null);
        }
        // Return unsubscribe function
        return () => {
            listeners = listeners.filter((l) => l !== callback);
        };
    },

    // Get current user synchronously (helper)
    currentUser: () => {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : null;
    }
};

// Simple event system for the mock service
let listeners = [];
const notifyListeners = (user) => {
    listeners.forEach((cb) => cb(user));
};
