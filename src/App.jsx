
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import WishlistDetail from './pages/WishlistDetail';
import PublicWishlistView from './pages/PublicWishlistView';
import { useAuth } from './context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null; // or spinner
  if (!user) return <Navigate to="/" />;
  return children;
};

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/shared/:id" element={<PublicWishlistView />} />

        {/* Protected Routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/wishlist/:id" element={
          <ProtectedRoute>
            <WishlistDetail />
          </ProtectedRoute>
        } />
      </Routes>
    </>
  );
}

export default App;
