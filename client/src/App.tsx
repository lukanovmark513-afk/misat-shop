import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider, useDispatch } from 'react-redux';
import { store, AppDispatch } from './store';
import { Toaster } from 'react-hot-toast';
import { fetchCart, mergeGuestCart } from './store/slices/cartSlice';
import { fetchFavorites } from './store/slices/favoritesSlice';
import ScrollToTop from './components/common/ScrollToTop';

// Layout
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

// User Pages
import HomePage from './pages/HomePage';
import CatalogPage from './pages/CatalogPage';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import FavoritesPage from './pages/FavoritesPage';
import ProfilePage from './pages/ProfilePage';
import SupportPage from './pages/SupportPage';
import CheckoutPage from './pages/CheckoutPage';
import OrdersPage from './pages/OrdersPage';
import BalanceTopupPage from './pages/BalanceTopupPage';

// Info Pages
import AboutPage from './pages/info/AboutPage';
import DeliveryPage from './pages/info/DeliveryPage';
import ReturnsPage from './pages/info/ReturnsPage';
import ContactsPage from './pages/info/ContactsPage';
import FaqPage from './pages/info/FaqPage';
import BlogPage from './pages/info/BlogPage';
import TrackingPage from './pages/info/TrackingPage';
import GiftCardPage from './pages/info/GiftCardPage';
import OfferPage from './pages/info/OfferPage';
import PrivacyPage from './pages/info/PrivacyPage';
import TermsPage from './pages/info/TermsPage';

// Admin Pages
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';
import AdminCategories from './pages/admin/AdminCategories';
import AdminUsers from './pages/admin/AdminUsers';
import AdminPromocodes from './pages/admin/AdminPromocodes';
import AdminChat from './pages/admin/AdminChat';

// Components
import ChatSupport from './components/chat/ChatSupport';
import { getCurrentUser } from './services/storageService';

const AppContent = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      dispatch(fetchCart());
      dispatch(fetchFavorites());
      dispatch(mergeGuestCart());
    }
  }, [dispatch]);

  return (
    <Router>
      <ScrollToTop />
      <Toaster
        position="bottom-center"
        toastOptions={{
          style: { background: '#000', color: '#fff', borderRadius: '0px' },
          duration: 2000
        }}
      />
      <Header />
      <main className="pt-20 min-h-screen">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/catalog" element={<CatalogPage />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/support" element={<SupportPage />} />
          <Route path="/balance-topup" element={<BalanceTopupPage />} />

          <Route path="/about" element={<AboutPage />} />
          <Route path="/delivery" element={<DeliveryPage />} />
          <Route path="/returns" element={<ReturnsPage />} />
          <Route path="/contacts" element={<ContactsPage />} />
          <Route path="/faq" element={<FaqPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/tracking" element={<TrackingPage />} />
          <Route path="/gift-card" element={<GiftCardPage />} />
          <Route path="/offer" element={<OfferPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />

          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="promocodes" element={<AdminPromocodes />} />
            <Route path="chat" element={<AdminChat />} />
          </Route>
        </Routes>
      </main>
      <Footer />
      <ChatSupport />
    </Router>
  );
};

const App = () => (
  <Provider store={store}>
    <AppContent />
  </Provider>
);

export default App;