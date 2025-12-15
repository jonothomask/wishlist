// REAL FIREBASE IMPLEMENTATION
// To use this:
// 1. Run: npm install firebase
// 2. Create project at console.firebase.google.com
// 3. Copy your config below

/* 
import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut as firebaseSignOut,
  onAuthStateChanged 
} from "firebase/auth";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs, 
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  arrayUnion,
  arrayRemove
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "...",
  appId: "..."
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

// --- AUTH SERVICE ---
export const authService = {
  signInWithGoogle: async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      return result.user;
    } catch (error) {
      console.error("Error signing in", error);
      throw error;
    }
  },
  signOut: () => firebaseSignOut(auth),
  onAuthStateChanged: (callback) => onAuthStateChanged(auth, callback),
  currentUser: () => auth.currentUser
};

// --- STORE SERVICE ---
export const storeService = {
  createWishlist: async (userId, title, description) => {
    const docRef = await addDoc(collection(db, "wishlists"), {
      userId,
      title,
      description,
      items: [],
      createdAt: new Date().toISOString(),
      isPublic: true
    });
    return { id: docRef.id, ...docRef }; // simplified return
  },

  getUserWishlists: async (userId) => {
    const q = query(collection(db, "wishlists"), where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  getWishlist: async (wishlistId) => {
    const docRef = doc(db, "wishlists", wishlistId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      throw new Error("No such document!");
    }
  },

  addItem: async (wishlistId, item) => {
    const newItem = { id: Date.now().toString(), ...item, addedAt: new Date().toISOString() };
    const listRef = doc(db, "wishlists", wishlistId);
    await updateDoc(listRef, {
      items: arrayUnion(newItem)
    });
    return newItem;
  },

  deleteItem: async (wishlistId, itemId) => {
    // Note: Deleting from array in Firestore requires the exact object to remove.
    // In a real app, you might read the doc, filter the array, and update it back.
    // Or use improved data structure (subcollections) for items.
    const listRef = doc(db, "wishlists", wishlistId);
    const docSnap = await getDoc(listRef);
    if(docSnap.exists()) {
        const list = docSnap.data();
        const updatedItems = list.items.filter(i => i.id !== itemId);
        await updateDoc(listRef, { items: updatedItems });
    }
  },

  deleteWishlist: async (wishlistId) => {
    await deleteDoc(doc(db, "wishlists", wishlistId));
  }
};
*/
