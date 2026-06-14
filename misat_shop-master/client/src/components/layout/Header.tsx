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
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchSuggestions, setSearchSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [userBalance, setUserBalance] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  const totalCartItems = cartItems.reduce((s: number, i: any) => s + i.quantity, 0);
  const totalFavorites = favorites.length;
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (isUserMenuOpen && !(e.target as Element).closest('.user-menu')) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isUserMenuOpen]);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    if (value.length > 1) {
      const products = getProducts();
      const suggestions = products
        .filter(p => p.name?.toLowerCase().includes(value.toLowerCase()))
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
      navigate(`/catalog?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setShowSuggestions(false);
      setShowMobileSearch(false);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
    setIsUserMenuOpen(false);
  };

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a] py-3 transition-all duration-300 ${isScrolled ? 'backdrop-blur-xl bg-[#0a0a0a]/95' : ''}`}>
        <div className="w-full px-4 md:px-8 lg:px-16">
          <div className="flex justify-between items-center">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-all duration-300 group shrink-0">
              <img
                src="/images/IMG_8965.jpeg"
                alt="MISAT Logo"
                className="h-8 w-auto object-contain brightness-0 invert group-hover:scale-105 transition-transform duration-300"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
              <span className="text-xl font-black tracking-tighter text-white">MISAT</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <Link to="/" className="text-white/70 text-sm uppercase tracking-wider hover:text-white transition-all duration-300">
                Главная
              </Link>
              <Link to="/catalog" className="text-white/70 text-sm uppercase tracking-wider hover:text-white transition-all duration-300">
                Каталог
              </Link>
              <Link to="/support" className="text-white/70 text-sm uppercase tracking-wider hover:text-white transition-all duration-300">
                Поддержка
              </Link>
              {isAdmin && (
                <Link to="/admin" className="text-white/50 text-sm uppercase tracking-wider hover:text-white transition-all duration-300">
                  Админ-панель
                </Link>
              )}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-5">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  placeholder="Поиск..."
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  onFocus={() => searchQuery.length > 1 && setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  className="w-48 pl-9 pr-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-sm text-white placeholder-gray-500 focus:border-white/50 focus:outline-none transition-all duration-300"
                />
                <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs"></i>

                {showSuggestions && searchSuggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl z-50 max-h-80 overflow-y-auto">
                    {searchSuggestions.map(suggestion => (
                      <button
                        key={suggestion.id}
                        onClick={() => {
                          navigate(`/product/${suggestion.id}`);
                          setShowSuggestions(false);
                          setSearchQuery('');
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-white/10 transition-all duration-200 flex items-center gap-3"
                      >
                        <img
                          src={suggestion.images?.[0] || suggestion.image || 'https://placehold.co/40x40/1a1a1a/666666'}
                          alt={suggestion.name}
                          className="w-8 h-8 object-cover rounded"
                        />
                        <div>
                          <p className="font-medium text-sm text-white line-clamp-1">{suggestion.name}</p>
                          <p className="text-xs text-gray-400">{suggestion.price?.toLocaleString()} ₽</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </form>

              <Link to="/favorites" className="relative group text-white/70 hover:text-white transition-all duration-300">
                <i className="far fa-heart text-xl group-hover:scale-110 transition-transform duration-300"></i>
                {totalFavorites > 0 && (
                  <span className="absolute -top-2 -right-2 bg-white text-black text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                    {totalFavorites}
                  </span>
                )}
              </Link>

              <Link to="/cart" className="relative group text-white/70 hover:text-white transition-all duration-300">
                <i className="fas fa-shopping-bag text-xl group-hover:scale-110 transition-transform duration-300"></i>
                {totalCartItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-white text-black text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                    {totalCartItems}
                  </span>
                )}
              </Link>

              {isAuthenticated ? (
                <div className="relative user-menu">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 text-white/70 hover:text-white transition-all duration-300 group"
                  >
                    <i className="far fa-user-circle text-xl group-hover:scale-110 transition-transform duration-300"></i>
                    <span className="text-sm hidden lg:inline">{user?.first_name || user?.email?.split('@')[0]}</span>
                    <i className={`fas fa-chevron-down text-xs transition-transform duration-300 ${isUserMenuOpen ? 'rotate-180' : ''}`}></i>
                  </button>

                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-[#1a1a1a] border border-white/10 shadow-2xl rounded-xl overflow-hidden animate-fadeInUp">
                      <div className="px-4 py-3 border-b border-white/10 bg-white/5">
                        <p className="text-[10px] text-gray-400 tracking-wider">БАЛАНС</p>
                        <p className="font-bold text-white text-lg">{userBalance.toLocaleString()} ₽</p>
                      </div>
                      <Link to="/profile" className="flex items-center gap-3 px-4 py-2.5 text-sm text-white/80 hover:bg-white/10 transition-all duration-200" onClick={() => setIsUserMenuOpen(false)}>
                        <i className="fas fa-user w-4 text-gray-500"></i> Профиль
                      </Link>
                      <Link to="/orders" className="flex items-center gap-3 px-4 py-2.5 text-sm text-white/80 hover:bg-white/10 transition-all duration-200" onClick={() => setIsUserMenuOpen(false)}>
                        <i className="fas fa-box w-4 text-gray-500"></i> Мои заказы
                      </Link>
                      <Link to="/balance-topup" className="flex items-center gap-3 px-4 py-2.5 text-sm text-white/80 hover:bg-white/10 transition-all duration-200" onClick={() => setIsUserMenuOpen(false)}>
                        <i className="fas fa-wallet w-4 text-gray-500"></i> Пополнить баланс
                      </Link>
                      <Link to="/gift-card" className="flex items-center gap-3 px-4 py-2.5 text-sm text-white/80 hover:bg-white/10 transition-all duration-200" onClick={() => setIsUserMenuOpen(false)}>
                        <i className="fas fa-gift w-4 text-gray-500"></i> Сертификаты
                      </Link>
                      <div className="border-t border-white/10 my-1"></div>
                      <button onClick={handleLogout} className="flex items-center gap-3 w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-white/10 transition-all duration-200">
                        <i className="fas fa-sign-out-alt w-4"></i> Выйти
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link to="/profile" className="text-white/70 hover:text-white transition-all duration-300">
                  <i className="far fa-user text-xl hover:scale-110 transition-transform duration-300"></i>
                </Link>
              )}
            </div>

            {/* Mobile Actions - только поиск и баланс (без серого овала) */}
            <div className="flex md:hidden items-center gap-3">
              {/* Иконка поиска */}
              <button
                onClick={() => setShowMobileSearch(!showMobileSearch)}
                className="text-white/70 hover:text-white transition-all duration-300"
              >
                <i className="fas fa-search text-xl"></i>
              </button>

              {/* Баланс (только для авторизованных) - без фона */}
              {isAuthenticated && (
                <Link to="/balance-topup" className="flex items-center gap-1 hover:opacity-80 transition">
                  <i className="fas fa-wallet text-white/60 text-xs"></i>
                  <span className="text-white text-xs font-bold">{userBalance.toLocaleString()} ₽</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Search Bar */}
      {showMobileSearch && (
        <div className="fixed top-16 left-0 right-0 z-40 bg-[#0a0a0a] border-b border-white/10 p-3 md:hidden animate-slideDown">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder="Поиск товаров..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
              className="w-full pl-10 pr-10 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-gray-500 focus:border-white/30 focus:outline-none transition-all duration-300"
            />
            <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm"></i>
            <button
              type="button"
              onClick={() => setShowMobileSearch(false)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition"
            >
              <i className="fas fa-times text-sm"></i>
            </button>
          </form>
        </div>
      )}

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.2s ease-out forwards;
        }

        .animate-slideDown {
          animation: slideDown 0.2s ease-out forwards;
        }

        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </>
  );
};

export default Header;