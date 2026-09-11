import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import { getProducts } from '../../services/storageService';

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
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
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const burgerButtonRef = useRef<HTMLButtonElement>(null);

  const totalCartItems = cartItems.reduce((s: number, i: any) => s + i.quantity, 0);
  const totalFavorites = favorites.length;
  const isAdmin = user?.role === 'admin';

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setShowMobileMenu(false);
        setShowMobileSearch(false);
      }
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
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      if (isUserMenuOpen && !(target as Element).closest('.user-menu')) {
        setIsUserMenuOpen(false);
      }

      if (showMobileMenu &&
          mobileMenuRef.current &&
          !mobileMenuRef.current.contains(target) &&
          burgerButtonRef.current &&
          !burgerButtonRef.current.contains(target)) {
        setShowMobileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isUserMenuOpen, showMobileMenu]);

  // Блокировка скролла при открытом меню
  useEffect(() => {
    if (showMobileMenu) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showMobileMenu]);

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
      setSearchSuggestions([]);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/catalog?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setShowSuggestions(false);
      setSearchSuggestions([]);
      setShowMobileSearch(false);
      setShowMobileMenu(false);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
    setIsUserMenuOpen(false);
    setShowMobileMenu(false);
  };

  const toggleMobileMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMobileMenu(prev => !prev);
    setShowMobileSearch(false);
  };

  const handleSuggestionClick = (productId: number) => {
    navigate(`/product/${productId}`);
    setSearchQuery('');
    setShowSuggestions(false);
    setSearchSuggestions([]);
    setShowMobileMenu(false);
  };

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50 px-3 md:px-4">
        <header
          className="transition-all duration-300"
          style={{
            background: isScrolled
              ? 'rgba(10,10,10,0.85)'
              : 'rgba(10,10,10,0.5)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderTop: 'none',
            borderTopLeftRadius: '0',
            borderTopRightRadius: '0',
            borderBottomLeftRadius: '24px',
            borderBottomRightRadius: '24px',
            padding: '10px 16px',
            minHeight: '60px'
          }}
        >
          <div className="w-full">
            <div className="flex items-center h-[40px] relative">
              {/* Desktop Navigation - LEFT */}
              <nav className="hidden md:flex items-center gap-1 flex-1">
                <Link
                  to="/"
                  className={`px-4 py-2 rounded-full transition-all duration-200 text-sm font-medium ${
                    isActive('/')
                      ? 'text-white font-semibold'
                      : 'text-white/80 hover:text-white'
                  }`}
                >
                  Главная
                </Link>

                <Link
                  to="/catalog"
                  className={`px-4 py-2 rounded-full transition-all duration-200 text-sm font-medium ${
                    isActive('/catalog')
                      ? 'text-white font-semibold'
                      : 'text-white/80 hover:text-white'
                  }`}
                >
                  Каталог
                </Link>

                <Link
                  to="/support"
                  className={`px-4 py-2 rounded-full transition-all duration-200 text-sm font-medium ${
                    isActive('/support')
                      ? 'text-white font-semibold'
                      : 'text-white/80 hover:text-white'
                  }`}
                >
                  Поддержка
                </Link>

                {isAdmin && (
                  <Link
                    to="/admin"
                    className={`px-4 py-2 rounded-full transition-all duration-200 text-sm font-medium ${
                      isActive('/admin')
                        ? 'text-white font-semibold'
                        : 'text-white/60 hover:text-white'
                    }`}
                  >
                    Админ
                  </Link>
                )}
              </nav>

              {/* Logo - CENTER (Desktop) */}
              <Link
                to="/"
                className="hidden md:flex items-center justify-center shrink-0"
                style={{
                  height: '40px',
                  width: '120px',
                  position: 'absolute',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  transition: 'opacity 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
              >
                <img
                  src="/images/логотип.png"
                  alt="MISAT Logo"
                  style={{
                    height: '90px',
                    width: 'auto',
                    maxWidth: '110px',
                    objectFit: 'contain'
                  }}
                  onError={(e) => {
                    const fallbackImg = (e.target as HTMLImageElement);
                    fallbackImg.src = '/images/IMG_8965.jpeg';
                    fallbackImg.style.height = '90px';
                    fallbackImg.style.width = 'auto';
                    fallbackImg.style.maxWidth = '110px';
                    fallbackImg.style.objectFit = 'contain';
                    fallbackImg.className = 'brightness-0 invert';
                  }}
                />
              </Link>

              {/* Desktop Actions - RIGHT */}
              <div className="hidden md:flex items-center gap-3 flex-1 justify-end">
                {/* Search */}
                <form onSubmit={handleSearch} className="relative">
                  <input
                    type="text"
                    placeholder="Поиск..."
                    value={searchQuery}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    onFocus={() => searchQuery.length > 1 && setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                    style={{
                      width: 180,
                      padding: '10px 16px 10px 40px',
                      background: 'transparent',
                      border: '1px solid rgba(255,255,255,0.15)',
                      borderRadius: '16px',
                      color: '#fff',
                      fontSize: '13px',
                      outline: 'none',
                      transition: 'all 0.2s ease'
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)';
                      e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
                      e.currentTarget.style.background = 'transparent';
                    }}
                  />
                  <i className="fas fa-search" style={{
                    position: 'absolute',
                    left: 14,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'rgba(255,255,255,0.5)',
                    fontSize: '13px'
                  }} />

                  {showSuggestions && searchSuggestions.length > 0 && (
                    <div style={{
                      position: 'absolute',
                      top: 'calc(100% + 8px)',
                      left: 0,
                      right: 0,
                      background: 'rgba(18,18,18,0.95)',
                      backdropFilter: 'blur(30px)',
                      WebkitBackdropFilter: 'blur(30px)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '20px',
                      boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
                      zIndex: 50,
                      maxHeight: 300,
                      overflowY: 'auto',
                      padding: '8px'
                    }}>
                      {searchSuggestions.map(suggestion => (
                        <button
                          key={suggestion.id}
                          onClick={() => handleSuggestionClick(suggestion.id)}
                          style={{
                            width: '100%',
                            textAlign: 'left',
                            padding: '10px 12px',
                            borderRadius: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 12,
                            background: 'transparent',
                            border: 'none',
                            color: '#fff',
                            cursor: 'pointer',
                            transition: 'background 0.15s ease'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
                          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                        >
                          <img
                            src={suggestion.images?.[0] || suggestion.image || 'https://placehold.co/40x40/1a1a1a/666666'}
                            alt={suggestion.name}
                            style={{
                              width: 36,
                              height: 36,
                              objectFit: 'cover',
                              borderRadius: 8
                            }}
                          />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{
                              fontSize: '13px',
                              fontWeight: 500,
                              margin: 0,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}>{suggestion.name}</p>
                            <p style={{
                              fontSize: '11px',
                              color: 'rgba(255,255,255,0.4)',
                              margin: 0
                            }}>{suggestion.price?.toLocaleString()} ₽</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </form>

                {/* Favorites */}
                <Link
                  to="/favorites"
                  style={{
                    position: 'relative',
                    color: '#fff',
                    transition: 'opacity 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '40px',
                    height: '40px'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'}
                  onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                >
                  <i className="far fa-heart" style={{ fontSize: '20px', lineHeight: 1 }} />
                  {totalFavorites > 0 && (
                    <span style={{
                      position: 'absolute',
                      top: 2,
                      right: 2,
                      background: '#FF453A',
                      borderRadius: '50%',
                      minWidth: 18,
                      height: 18,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '9px',
                      fontWeight: 600,
                      color: '#fff',
                      padding: '0 4px',
                      lineHeight: 1
                    }}>
                      {totalFavorites}
                    </span>
                  )}
                </Link>

                {/* Cart */}
                <Link
                  to="/cart"
                  style={{
                    position: 'relative',
                    color: '#fff',
                    transition: 'opacity 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '40px',
                    height: '40px'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'}
                  onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                >
                  <i className="fas fa-shopping-bag" style={{ fontSize: '20px', lineHeight: 1 }} />
                  {totalCartItems > 0 && (
                    <span style={{
                      position: 'absolute',
                      top: 2,
                      right: 2,
                      background: '#FF453A',
                      borderRadius: '50%',
                      minWidth: 18,
                      height: 18,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '9px',
                      fontWeight: 600,
                      color: '#fff',
                      padding: '0 4px',
                      lineHeight: 1
                    }}>
                      {totalCartItems}
                    </span>
                  )}
                </Link>

                {/* User Menu */}
                {isAuthenticated ? (
                  <div className="relative user-menu">
                    <button
                      onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        color: '#fff',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'opacity 0.2s ease',
                        padding: '4px 8px',
                        borderRadius: '12px',
                        height: '40px'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'}
                      onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                    >
                      <span style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '40px',
                        height: '40px'
                      }}>
                        <i className="far fa-user-circle" style={{ fontSize: '22px', lineHeight: 1 }} />
                      </span>
                      <span className="hidden lg:inline text-[13px] font-medium">
                        {user?.first_name || user?.email?.split('@')[0]}
                      </span>
                      <i className="fas fa-chevron-down" style={{
                        fontSize: '10px',
                        transition: 'transform 0.2s ease',
                        transform: isUserMenuOpen ? 'rotate(180deg)' : 'rotate(0)',
                        lineHeight: 1
                      }} />
                    </button>

                    {isUserMenuOpen && (
                      <div style={{
                        position: 'absolute',
                        right: 0,
                        top: 'calc(100% + 8px)',
                        width: 260,
                        background: 'rgba(18,18,18,0.95)',
                        backdropFilter: 'blur(30px)',
                        WebkitBackdropFilter: 'blur(30px)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '24px',
                        boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
                        overflow: 'hidden',
                        animation: 'fadeInUp 0.25s ease forwards'
                      }}>
                        <div style={{
                          padding: '16px 20px',
                          margin: '12px 12px 8px',
                          background: 'rgba(255,255,255,0.04)',
                          border: '1px solid rgba(255,255,255,0.06)',
                          borderRadius: '20px'
                        }}>
                          <p style={{
                            fontSize: '9px',
                            color: 'rgba(255,255,255,0.5)',
                            letterSpacing: '0.2em',
                            fontWeight: 600,
                            margin: '0 0 4px'
                          }}>БАЛАНС</p>
                          <p style={{
                            fontSize: '20px',
                            fontWeight: 600,
                            color: '#fff',
                            margin: 0,
                            letterSpacing: '-0.02em'
                          }}>{userBalance.toLocaleString()} ₽</p>
                        </div>

                        <div style={{ padding: '4px 8px' }}>
                          <Link
                            to="/profile"
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 12,
                              padding: '10px 12px',
                              borderRadius: '12px',
                              color: '#fff',
                              textDecoration: 'none',
                              fontSize: '13px',
                              fontWeight: 500,
                              transition: 'background 0.15s ease'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
                            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <i className="fas fa-user" style={{ width: 16, color: 'rgba(255,255,255,0.5)' }} />
                            Профиль
                          </Link>

                          <Link
                            to="/orders"
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 12,
                              padding: '10px 12px',
                              borderRadius: '12px',
                              color: '#fff',
                              textDecoration: 'none',
                              fontSize: '13px',
                              fontWeight: 500,
                              transition: 'background 0.15s ease'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
                            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <i className="fas fa-box" style={{ width: 16, color: 'rgba(255,255,255,0.5)' }} />
                            Мои заказы
                          </Link>

                          <Link
                            to="/balance-topup"
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 12,
                              padding: '10px 12px',
                              borderRadius: '12px',
                              color: '#fff',
                              textDecoration: 'none',
                              fontSize: '13px',
                              fontWeight: 500,
                              transition: 'background 0.15s ease'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
                            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <i className="fas fa-wallet" style={{ width: 16, color: 'rgba(255,255,255,0.5)' }} />
                            Пополнить баланс
                          </Link>

                          <Link
                            to="/gift-card"
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 12,
                              padding: '10px 12px',
                              borderRadius: '12px',
                              color: '#fff',
                              textDecoration: 'none',
                              fontSize: '13px',
                              fontWeight: 500,
                              transition: 'background 0.15s ease'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
                            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <i className="fas fa-gift" style={{ width: 16, color: 'rgba(255,255,255,0.5)' }} />
                            Сертификаты
                          </Link>
                        </div>

                        <div style={{
                          height: 1,
                          margin: '4px 16px',
                          background: 'rgba(255,255,255,0.08)'
                        }} />

                        <div style={{ padding: '4px 8px 12px' }}>
                          <button
                            onClick={handleLogout}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 12,
                              padding: '10px 12px',
                              borderRadius: '12px',
                              color: '#FF453A',
                              background: 'transparent',
                              border: 'none',
                              width: '100%',
                              fontSize: '13px',
                              fontWeight: 500,
                              cursor: 'pointer',
                              transition: 'background 0.15s ease'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,69,58,0.08)'}
                            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                          >
                            <i className="fas fa-sign-out-alt" style={{ width: 16 }} />
                            Выйти
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    to="/profile"
                    style={{
                      color: '#fff',
                      transition: 'opacity 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '40px',
                      height: '40px'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'}
                    onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                  >
                    <i className="far fa-user" style={{ fontSize: '20px', lineHeight: 1 }} />
                  </Link>
                )}
              </div>

              {/* ===== MOBILE HEADER ===== */}
              <div className="flex md:hidden items-center justify-between w-full">
                {/* Левая часть: Бургер-меню */}
                <button
                  ref={burgerButtonRef}
                  onClick={toggleMobileMenu}
                  style={{
                    color: '#fff',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'opacity 0.2s ease',
                    padding: '4px',
                    width: '40px',
                    height: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 60
                  }}
                >
                  <i className={`fas ${showMobileMenu ? 'fa-times' : 'fa-bars'}`} style={{ fontSize: '20px' }} />
                </button>

                {/* Центр: Логотип */}
                <Link
                  to="/"
                  className="flex items-center justify-center"
                  style={{
                    height: '36px',
                    position: 'absolute',
                    left: '50%',
                    transform: 'translateX(-50%)'
                  }}
                >
                  <img
                    src="/images/логотип.png"
                    alt="MISAT"
                    style={{
                      height: '70px',
                      width: 'auto',
                      maxWidth: '80px',
                      objectFit: 'contain'
                    }}
                    onError={(e) => {
                      const fallbackImg = (e.target as HTMLImageElement);
                      fallbackImg.src = '/images/IMG_8965.jpeg';
                      fallbackImg.style.height = '70px';
                      fallbackImg.style.width = 'auto';
                      fallbackImg.style.maxWidth = '80px';
                      fallbackImg.style.objectFit = 'contain';
                      fallbackImg.className = 'brightness-0 invert';
                    }}
                  />
                </Link>

                {/* Правая часть: Иконки */}
                <div className="flex items-center gap-1">
                  {/* Избранное */}
                  <Link
                    to="/favorites"
                    style={{
                      position: 'relative',
                      color: '#fff',
                      transition: 'opacity 0.2s ease',
                      padding: '4px',
                      width: '36px',
                      height: '36px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <i className="far fa-heart" style={{ fontSize: '18px' }} />
                    {totalFavorites > 0 && (
                      <span style={{
                        position: 'absolute',
                        top: '0px',
                        right: '0px',
                        minWidth: '16px',
                        height: '16px',
                        padding: '0 4px',
                        borderRadius: '9999px',
                        background: '#FF453A',
                        color: '#fff',
                        fontSize: '8px',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        {totalFavorites > 9 ? '9+' : totalFavorites}
                      </span>
                    )}
                  </Link>

                  {/* Корзина */}
                  <Link
                    to="/cart"
                    style={{
                      position: 'relative',
                      color: '#fff',
                      transition: 'opacity 0.2s ease',
                      padding: '4px',
                      width: '36px',
                      height: '36px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <i className="fas fa-shopping-bag" style={{ fontSize: '18px' }} />
                    {totalCartItems > 0 && (
                      <span style={{
                        position: 'absolute',
                        top: '0px',
                        right: '0px',
                        minWidth: '16px',
                        height: '16px',
                        padding: '0 4px',
                        borderRadius: '9999px',
                        background: '#FF453A',
                        color: '#fff',
                        fontSize: '8px',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        {totalCartItems > 9 ? '9+' : totalCartItems}
                      </span>
                    )}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </header>
      </div>

      {/* Overlay */}
      {showMobileMenu && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(4px)',
            WebkitBackdropFilter: 'blur(4px)',
            zIndex: 55,
            animation: 'fadeIn 0.3s ease forwards'
          }}
          onClick={() => setShowMobileMenu(false)}
        />
      )}

      {/* Mobile Side Menu */}
      <div
        ref={mobileMenuRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          bottom: 0,
          width: '85%',
          maxWidth: '360px',
          background: 'rgba(10,10,10,0.98)',
          backdropFilter: 'blur(30px)',
          WebkitBackdropFilter: 'blur(30px)',
          borderRight: '1px solid rgba(255,255,255,0.1)',
          zIndex: 56,
          transform: showMobileMenu ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          display: 'flex',
          flexDirection: 'column',
          overflowY: 'auto'
        }}
      >
        {/* Заголовок меню */}
        <div style={{
          padding: '20px',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <Link to="/" onClick={() => setShowMobileMenu(false)}>
            <img
              src="/images/логотип.png"
              alt="MISAT"
              style={{
                height: '60px',
                width: 'auto',
                maxWidth: '90px',
                objectFit: 'contain'
              }}
              onError={(e) => {
                const fallbackImg = (e.target as HTMLImageElement);
                fallbackImg.src = '/images/IMG_8965.jpeg';
                fallbackImg.style.height = '60px';
                fallbackImg.style.width = 'auto';
                fallbackImg.style.maxWidth = '90px';
                fallbackImg.style.objectFit = 'contain';
                fallbackImg.className = 'brightness-0 invert';
              }}
            />
          </Link>
          <button
            onClick={() => setShowMobileMenu(false)}
            style={{
              color: '#fff',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: '8px',
              fontSize: '20px'
            }}
          >
            <i className="fas fa-times" />
          </button>
        </div>

        {/* Поиск */}
        <div style={{ padding: '16px 20px' }}>
          <form onSubmit={handleSearch} style={{ position: 'relative' }}>
            <input
              type="text"
              placeholder="Поиск товаров..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 44px 12px 44px',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: '16px',
                color: '#fff',
                fontSize: '15px',
                outline: 'none',
                transition: 'all 0.2s ease'
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)';
                e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
                e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
              }}
            />
            <i className="fas fa-search" style={{
              position: 'absolute',
              left: 16,
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'rgba(255,255,255,0.5)',
              fontSize: '14px'
            }} />
          </form>

          {/* Поисковые подсказки */}
          {searchQuery.length > 1 && searchSuggestions.length > 0 && (
            <div style={{ marginTop: '12px' }}>
              {searchSuggestions.map(suggestion => (
                <button
                  key={suggestion.id}
                  onClick={() => handleSuggestionClick(suggestion.id)}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '10px 12px',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    background: 'transparent',
                    border: 'none',
                    color: '#fff',
                    cursor: 'pointer',
                    transition: 'background 0.15s ease',
                    marginBottom: '4px'
                  }}
                >
                  <img
                    src={suggestion.images?.[0] || suggestion.image || 'https://placehold.co/40x40/1a1a1a/666666'}
                    alt={suggestion.name}
                    style={{
                      width: 36,
                      height: 36,
                      objectFit: 'cover',
                      borderRadius: 8
                    }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{
                      fontSize: '13px',
                      fontWeight: 500,
                      margin: 0,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>{suggestion.name}</p>
                    <p style={{
                      fontSize: '11px',
                      color: 'rgba(255,255,255,0.4)',
                      margin: 0
                    }}>{suggestion.price?.toLocaleString()} ₽</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Навигация */}
        <nav style={{ padding: '8px 12px', flex: 1 }}>
          <Link
            to="/"
            onClick={() => setShowMobileMenu(false)}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '14px 16px',
              borderRadius: '12px',
              color: isActive('/') ? '#fff' : 'rgba(255,255,255,0.7)',
              textDecoration: 'none',
              fontSize: '15px',
              fontWeight: isActive('/') ? 600 : 400,
              background: isActive('/') ? 'rgba(255,255,255,0.08)' : 'transparent',
              transition: 'background 0.15s ease',
              marginBottom: '4px'
            }}
          >
            <i className="fas fa-home" style={{ width: 24, marginRight: 12 }} />
            Главная
          </Link>

          <Link
            to="/catalog"
            onClick={() => setShowMobileMenu(false)}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '14px 16px',
              borderRadius: '12px',
              color: isActive('/catalog') ? '#fff' : 'rgba(255,255,255,0.7)',
              textDecoration: 'none',
              fontSize: '15px',
              fontWeight: isActive('/catalog') ? 600 : 400,
              background: isActive('/catalog') ? 'rgba(255,255,255,0.08)' : 'transparent',
              transition: 'background 0.15s ease',
              marginBottom: '4px'
            }}
          >
            <i className="fas fa-th-large" style={{ width: 24, marginRight: 12 }} />
            Каталог
          </Link>

          <Link
            to="/support"
            onClick={() => setShowMobileMenu(false)}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '14px 16px',
              borderRadius: '12px',
              color: isActive('/support') ? '#fff' : 'rgba(255,255,255,0.7)',
              textDecoration: 'none',
              fontSize: '15px',
              fontWeight: isActive('/support') ? 600 : 400,
              background: isActive('/support') ? 'rgba(255,255,255,0.08)' : 'transparent',
              transition: 'background 0.15s ease',
              marginBottom: '4px'
            }}
          >
            <i className="fas fa-headset" style={{ width: 24, marginRight: 12 }} />
            Поддержка
          </Link>

          {isAdmin && (
            <Link
              to="/admin"
              onClick={() => setShowMobileMenu(false)}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '14px 16px',
                borderRadius: '12px',
                color: isActive('/admin') ? '#fff' : 'rgba(255,255,255,0.5)',
                textDecoration: 'none',
                fontSize: '15px',
                fontWeight: isActive('/admin') ? 600 : 400,
                background: isActive('/admin') ? 'rgba(255,255,255,0.08)' : 'transparent',
                transition: 'background 0.15s ease',
                marginBottom: '4px'
              }}
            >
              <i className="fas fa-shield-alt" style={{ width: 24, marginRight: 12 }} />
              Админ
            </Link>
          )}
        </nav>

        {/* Нижняя часть с пользователем */}
        <div style={{
          padding: '16px 20px',
          borderTop: '1px solid rgba(255,255,255,0.08)'
        }}>
          {isAuthenticated ? (
            <>
              <div style={{
                padding: '12px 16px',
                marginBottom: '12px',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '12px'
              }}>
                <p style={{
                  fontSize: '10px',
                  color: 'rgba(255,255,255,0.5)',
                  letterSpacing: '0.1em',
                  fontWeight: 600,
                  margin: '0 0 4px'
                }}>БАЛАНС</p>
                <p style={{
                  fontSize: '18px',
                  fontWeight: 600,
                  color: '#fff',
                  margin: 0
                }}>{userBalance.toLocaleString()} ₽</p>
              </div>

              <Link
                to="/profile"
                onClick={() => setShowMobileMenu(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  color: '#fff',
                  textDecoration: 'none',
                  fontSize: '14px',
                  transition: 'background 0.15s ease',
                  marginBottom: '4px'
                }}
              >
                <i className="fas fa-user" style={{ width: 20, marginRight: 12 }} />
                Профиль
              </Link>

              <Link
                to="/orders"
                onClick={() => setShowMobileMenu(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  color: '#fff',
                  textDecoration: 'none',
                  fontSize: '14px',
                  transition: 'background 0.15s ease',
                  marginBottom: '4px'
                }}
              >
                <i className="fas fa-box" style={{ width: 20, marginRight: 12 }} />
                Мои заказы
              </Link>

              <button
                onClick={handleLogout}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  color: '#FF453A',
                  background: 'transparent',
                  border: 'none',
                  width: '100%',
                  textAlign: 'left',
                  fontSize: '14px',
                  cursor: 'pointer',
                  transition: 'background 0.15s ease'
                }}
              >
                <i className="fas fa-sign-out-alt" style={{ width: 20, marginRight: 12 }} />
                Выйти
              </button>
            </>
          ) : (
            <Link
              to="/profile"
              onClick={() => setShowMobileMenu(false)}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '12px 16px',
                borderRadius: '12px',
                color: '#fff',
                textDecoration: 'none',
                fontSize: '14px',
                transition: 'background 0.15s ease'
              }}
            >
              <i className="fas fa-sign-in-alt" style={{ width: 20, marginRight: 12 }} />
              Войти
            </Link>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(8px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
};

export default Header;