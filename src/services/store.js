
// Mock Store Service
// Simulates a Database (like Firestore) for Wishlists

const DB_DELAY = 500;
const DB_KEY = 'wishlist_mock_db';

// Helper to get DB
const getDB = () => {
    const data = localStorage.getItem(DB_KEY);
    return data ? JSON.parse(data) : { wishlists: [] };
};

// Helper to save DB
const saveDB = (data) => {
    localStorage.setItem(DB_KEY, JSON.stringify(data));
};

export const store = {
    // Create a new wishlist
    createWishlist: async (userId, title, description) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const db = getDB();
                const newWishlist = {
                    id: 'list-' + Date.now(),
                    userId,
                    title,
                    description,
                    items: [],
                    createdAt: new Date().toISOString(),
                    isPublic: true // Default to true for sharing
                };
                db.wishlists.push(newWishlist);
                saveDB(db);
                resolve(newWishlist);
            }, DB_DELAY);
        });
    },

    // Get user's wishlists
    getUserWishlists: async (userId) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const db = getDB();
                const userLists = db.wishlists.filter(w => w.userId === userId);
                resolve(userLists.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
            }, DB_DELAY);
        });
    },

    // Get single wishlist (by ID) - for public sharing
    getWishlist: async (wishlistId) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const db = getDB();
                const list = db.wishlists.find(w => w.id === wishlistId);
                if (list) resolve(list);
                else reject(new Error('Wishlist not found'));
            }, DB_DELAY);
        });
    },

    // Add item to wishlist
    addItem: async (wishlistId, item) => {
        // item: { url (optional), name, price, notes }
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const db = getDB();
                const listIndex = db.wishlists.findIndex(w => w.id === wishlistId);
                if (listIndex === -1) {
                    reject(new Error('Wishlist not found'));
                    return;
                }

                const newItem = {
                    id: 'item-' + Date.now(),
                    ...item,
                    addedAt: new Date().toISOString()
                };

                db.wishlists[listIndex].items.push(newItem);
                saveDB(db);
                resolve(newItem);
            }, DB_DELAY);
        });
    },

    // Delete item
    deleteItem: async (wishlistId, itemId) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const db = getDB();
                const listIndex = db.wishlists.findIndex(w => w.id === wishlistId);
                if (listIndex !== -1) {
                    db.wishlists[listIndex].items = db.wishlists[listIndex].items.filter(i => i.id !== itemId);
                    saveDB(db);
                }
                resolve();
            }, DB_DELAY);
        });
    },

    // Delete wishlist
    deleteWishlist: async (wishlistId) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const db = getDB();
                db.wishlists = db.wishlists.filter(w => w.id !== wishlistId);
                saveDB(db);
                resolve();
            }, DB_DELAY);
        });
    }
};
