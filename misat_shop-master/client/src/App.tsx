import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider, useDispatch } from 'react-redux';
import { store, AppDispatch } from './store';
import { Toaster } from 'react-hot-toast';
import { HelmetProvider } from 'react-helmet-async';
import { fetchCart, mergeGuestCart } from './store/slices/cartSlice';
import { fetchFavorites } from './store/slices/favoritesSlice';
import { loadUser } from './store/slices/authSlice';
import ScrollToTop from './components/common/ScrollToTop';
import AnimatedEntry from './components/AnimatedEntry';

// Layout
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import MobileBottomNav from './components/layout/MobileBottomNav';

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
import AdminBrands from './pages/admin/AdminBrands';
import AdminCategories from './pages/admin/AdminCategories';
import AdminUsers from './pages/admin/AdminUsers';
import AdminPromocodes from './pages/admin/AdminPromocodes';
import AdminChat from './pages/admin/AdminChat';

// Chat Page
import ChatPage from './pages/ChatPage';

// Chat Component
import ChatSupport from './components/chat/ChatSupport';
import { getCurrentUser } from './services/storageService';

// Создаем HelmetProvider с настройками
const helmetContext = {};

const AppContent = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [isMobile, setIsMobile] = React.useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    // Загружаем пользователя при старте
    dispatch(loadUser());
    dispatch(fetchFavorites());

    const user = getCurrentUser();
    if (user) {
      dispatch(fetchCart());
      dispatch(mergeGuestCart());
    }
  }, [dispatch]);

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0a]">
      <Header />
      <main className="flex-1 pt-0 pb-[3px] md:pb-0">
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
          <Route path="/chat" element={<ChatPage />} />

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
            <Route path="brands" element={<AdminBrands />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="promocodes" element={<AdminPromocodes />} />
            <Route path="chat" element={<AdminChat />} />
          </Route>
        </Routes>
      </main>
      <Footer />

      {/* Чат только на ПК (как плавающая кнопка) */}
      {!isMobile && <ChatSupport />}

      {/* Навигация только на телефоне */}
      <MobileBottomNav />
    </div>
  );
};

const App = () => (
  <Provider store={store}>
    <HelmetProvider context={helmetContext}>
      <Router>
        <ScrollToTop />
        <Toaster
          position="top-center"
          gutter={8}
          containerStyle={{
            top: 80,
            zIndex: 9999,
          }}
          toastOptions={{
            duration: 3000,
            success: {
              duration: 2500,
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
            error: {
              duration: 3500,
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
            style: {
              background: '#1a1a1a',
              color: '#fff',
              borderRadius: '12px',
              border: '1px solid rgba(255,255,255,0.1)',
              padding: '10px 16px',
              fontSize: '13px',
              backdropFilter: 'blur(10px)',
            },
          }}
        />
        <AnimatedEntry duration={2500}>
          <AppContent />
        </AnimatedEntry>
      </Router>
    </HelmetProvider>
  </Provider>
);

export default App;