import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import { getProducts } from '../../services/storageService';

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state: any) => state.auth);
  const cartItems = useSelector((state: any) => state.cart.items);
  const favorites = useSelector((state: any) => state.favorites.items);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchSuggestions, setSearchSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [userBalance, setUserBalance] = useState(0);

  const totalCartItems = cartItems.reduce((s: number, i: any) => s + i.quantity, 0);
  const totalFavorites = favorites.length;
  const isAdmin = user?.role === 'admin';

  // Обновление баланса
  useEffect(() => {
    const updateBalance = () => {
      const userData = JSON.parse(localStorage.getItem('misat_current_user') || '{}');
      setUserBalance(userData.balance || 0);
    };
    updateBalance();
    window.addEventListener('balanceUpdated', updateBalance);
    return () => window.removeEventListener('balanceUpdated', updateBalance);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    if (value.length > 1) {
      const products = getProducts();
      const suggestions = products
        .filter(p => p.name.toLowerCase().includes(value.toLowerCase()))
        .slice(0, 5);
      setSearchSuggestions(suggestions);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/catalog?search=${searchQuery}`);
      setSearchQuery('');
      setShowSuggestions(false);
      setIsMenuOpen(false);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
    setIsMenuOpen(false);
    setIsUserMenuOpen(false);
  };

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? 'bg-white/95 backdrop-blur-md shadow-sm py-2' : 'bg-white py-3'}`}>
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <img
                src="/images/IMG_8965.jpeg"
                alt="MISAT Logo"
                className="h-8 w-auto object-contain"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
              <span className="text-xl font-black tracking-tighter">MISAT</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              <Link to="/" className="text-sm uppercase tracking-wider hover:opacity-60">Главная</Link>
              <Link to="/catalog" className="text-sm uppercase tracking-wider hover:opacity-60">Каталог</Link>
              <Link to="/support" className="text-sm uppercase tracking-wider hover:opacity-60">Поддержка</Link>
              {isAdmin && (
                <Link to="/admin" className="text-sm uppercase tracking-wider text-gray-500 hover:text-black">
                  Админ-панель
                </Link>
              )}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-4">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  placeholder="Поиск..."
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  onFocus={() => searchQuery.length > 1 && setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  className="w-48 pl-9 pr-3 py-1.5 border border-gray-200 rounded-full text-sm focus:outline-none focus:border-black"
                />
                <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs"></i>

                {showSuggestions && searchSuggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-xl shadow-lg z-50 max-h-80 overflow-y-auto">
                    {searchSuggestions.map(suggestion => (
                      <button
                        key={suggestion.id}
                        onClick={() => {
                          navigate(`/product/${suggestion.id}`);
                          setShowSuggestions(false);
                          setSearchQuery('');
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 transition flex items-center gap-3"
                      >
                        <img src={suggestion.images?.[0] || suggestion.image} alt={suggestion.name} className="w-8 h-8 object-cover rounded" />
                        <div>
                          <p className="font-medium text-sm">{suggestion.name}</p>
                          <p className="text-xs text-gray-500">{suggestion.price.toLocaleString()} ₽</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </form>

              {/* Ссылка на избранное */}
              <Link to="/favorites" className="relative group">
                <i className="far fa-heart text-xl group-hover:scale-110 transition"></i>
                {totalFavorites > 0 && (
                  <span className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {totalFavorites}
                  </span>
                )}
              </Link>

              {/* Ссылка на корзину */}
              <Link to="/cart" className="relative group">
                <i className="fas fa-shopping-bag text-xl group-hover:scale-110 transition"></i>
                {totalCartItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {totalCartItems}
                  </span>
                )}
              </Link>

              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 hover:opacity-70 transition"
                  >
                    <i className="far fa-user-circle text-xl"></i>
                    <span className="text-sm">{user?.first_name || user?.email?.split('@')[0]}</span>
                    <i className="fas fa-chevron-down text-xs"></i>
                  </button>
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white border-2 border-black shadow-lg z-10">
                      {/* Баланс */}
                      <div className="px-4 py-2 border-b bg-gray-50">
                        <p className="text-xs text-gray-500">Баланс</p>
                        <p className="font-bold text-green-600">{userBalance.toLocaleString()} ₽</p>
                      </div>
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm hover:bg-gray-100 transition"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <i className="fas fa-user mr-2"></i> Профиль
                      </Link>
                      <Link
                        to="/orders"
                        className="block px-4 py-2 text-sm hover:bg-gray-100 transition"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <i className="fas fa-box mr-2"></i> Мои заказы
                      </Link>
                      <Link
                        to="/balance-topup"
                        className="block px-4 py-2 text-sm hover:bg-gray-100 transition"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <i className="fas fa-wallet mr-2"></i> Пополнить баланс
                      </Link>
                      <Link
                        to="/gift-card"
                        className="block px-4 py-2 text-sm hover:bg-gray-100 transition"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <i className="fas fa-gift mr-2"></i> Подарочные сертификаты
                      </Link>
                      <hr className="my-1" />
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-100 transition"
                      >
                        <i className="fas fa-sign-out-alt mr-2"></i> Выйти
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link to="/profile">
                  <i className="far fa-user text-xl"></i>
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden w-10 h-10 flex items-center justify-center rounded-full active:bg-gray-100"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <i className={`fas fa-${isMenuOpen ? 'times' : 'bars'} text-2xl`}></i>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setIsMenuOpen(false)} />
          <div className="fixed top-0 right-0 h-full w-80 bg-white z-50 shadow-xl p-6 overflow-y-auto animate-slideInRight md:hidden">
            <div className="flex justify-between items-center mb-6 pb-4 border-b">
              <div className="flex items-center gap-2">
                <img src="/images/IMG_8965.jpeg" alt="Logo" className="h-8 w-auto" />
                <span className="text-xl font-black">MISAT</span>
              </div>
              <button onClick={() => setIsMenuOpen(false)} className="text-2xl w-10 h-10 flex items-center justify-center">✕</button>
            </div>

            <nav className="flex flex-col gap-4">
              <Link to="/" className="text-base py-2 hover:text-gray-600" onClick={() => setIsMenuOpen(false)}>
                <i className="fas fa-home w-6 mr-3"></i> Главная
              </Link>
              <Link to="/catalog" className="text-base py-2 hover:text-gray-600" onClick={() => setIsMenuOpen(false)}>
                <i className="fas fa-search w-6 mr-3"></i> Каталог
              </Link>
              <Link to="/favorites" className="text-base py-2 hover:text-gray-600" onClick={() => setIsMenuOpen(false)}>
                <i className="far fa-heart w-6 mr-3"></i> Избранное
                {totalFavorites > 0 && (
                  <span className="ml-2 bg-black text-white text-xs rounded-full w-5 h-5 inline-flex items-center justify-center">
                    {totalFavorites}
                  </span>
                )}
              </Link>
              <Link to="/cart" className="text-base py-2 hover:text-gray-600" onClick={() => setIsMenuOpen(false)}>
                <i className="fas fa-shopping-bag w-6 mr-3"></i> Корзина
                {totalCartItems > 0 && (
                  <span className="ml-2 bg-black text-white text-xs rounded-full w-5 h-5 inline-flex items-center justify-center">
                    {totalCartItems}
                  </span>
                )}
              </Link>
              <Link to="/profile" className="text-base py-2 hover:text-gray-600" onClick={() => setIsMenuOpen(false)}>
                <i className="far fa-user w-6 mr-3"></i> Профиль
              </Link>
              <Link to="/orders" className="text-base py-2 hover:text-gray-600" onClick={() => setIsMenuOpen(false)}>
                <i className="fas fa-box w-6 mr-3"></i> Заказы
              </Link>
              <Link to="/balance-topup" className="text-base py-2 hover:text-gray-600" onClick={() => setIsMenuOpen(false)}>
                <i className="fas fa-wallet w-6 mr-3"></i> Пополнить баланс
              </Link>
              <Link to="/gift-card" className="text-base py-2 hover:text-gray-600" onClick={() => setIsMenuOpen(false)}>
                <i className="fas fa-gift w-6 mr-3"></i> Сертификаты
              </Link>
              <Link to="/support" className="text-base py-2 hover:text-gray-600" onClick={() => setIsMenuOpen(false)}>
                <i className="fas fa-headset w-6 mr-3"></i> Поддержка
              </Link>
              {isAdmin && (
                <Link to="/admin" className="text-base py-2 text-purple-600" onClick={() => setIsMenuOpen(false)}>
                  <i className="fas fa-shield-alt w-6 mr-3"></i> Админ-панель
                </Link>
              )}
              <hr className="my-2" />
              <div className="bg-gray-50 p-3 rounded-xl mb-2">
                <p className="text-xs text-gray-500">Баланс</p>
                <p className="font-bold text-green-600 text-lg">{userBalance.toLocaleString()} ₽</p>
              </div>
              <form onSubmit={handleSearch} className="relative mt-2">
                <input
                  type="text"
                  placeholder="Поиск..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-full text-sm"
                />
                <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
              </form>
              {isAuthenticated && (
                <button onClick={handleLogout} className="text-base py-2 text-red-500 text-left">
                  <i className="fas fa-sign-out-alt w-6 mr-3"></i> Выйти
                </button>
              )}
            </nav>
          </div>
        </>
      )}
    </>
  );
};

export default Header;