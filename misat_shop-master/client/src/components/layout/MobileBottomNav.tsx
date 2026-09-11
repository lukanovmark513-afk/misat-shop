import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAppSelector } from '../../store/hooks';

const MobileBottomNav = () => {
  const location = useLocation();
  const [unreadCount, setUnreadCount] = React.useState(0);

  // Проверяем непрочитанные сообщения
  React.useEffect(() => {
    const checkUnread = () => {
      try {
        const allMessages = JSON.parse(localStorage.getItem('misat_chat_messages') || '[]');
        const user = JSON.parse(localStorage.getItem('misat_current_user') || '{}');
        if (user?.id) {
          const unread = allMessages.filter((m: any) => m.userId === user.id && m.isAdmin && !m.isRead);
          setUnreadCount(unread.length);
        }
      } catch (e) {
        console.error('Error checking unread messages:', e);
      }
    };
    checkUnread();
    const interval = setInterval(checkUnread, 5000);
    return () => clearInterval(interval);
  }, []);

  const isActive = (path: string) => location.pathname === path;
  const getColor = (path: string) => isActive(path) ? '#FFFFFF' : 'rgba(255,255,255,0.4)';

  const navItems = [
    { path: '/', icon: 'fa-house', label: 'Главная' },
    { path: '/favorites', icon: 'fa-heart', label: 'Избранное' },
    { path: '/chat', icon: 'fa-comment-dots', label: 'Чат', badge: true, badgeCount: unreadCount },
    { path: '/profile', icon: 'fa-user', label: 'Профиль' }
  ];

  return (
    <div
      className="mobile-bottom-nav"
      style={{
        position: 'fixed',
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 50,
        display: 'flex',
        justifyContent: 'center',
        padding: '0 16px 16px'
      }}
    >
      <style>{`
        @media (min-width: 768px) {
          .mobile-bottom-nav {
            display: none !important;
          }
        }

        .nav-wrapper {
          position: relative;
          width: 100%;
          max-width: 420px;
        }

        .bottom-bar {
          position: relative;
          width: 100%;
          height: 72px;
          border-radius: 28px;
          background: rgba(10, 10, 10, 0.4);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1px solid rgba(255, 255, 255, 0.06);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
          display: flex;
          align-items: center;
          padding: 0 8px;
        }

        .bottom-bar::before,
        .bottom-bar::after {
          display: none;
        }

        .catalog-bridge {
          position: absolute;
          left: 50%;
          top: -2px;
          transform: translateX(-50%);
          width: 86px;
          height: 8px;
          border-radius: 20px 20px 0 0;
          background: rgba(10, 10, 10, 0.4);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-bottom: none;
          z-index: 0;
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
        }

        .catalog-wrap {
          position: absolute;
          left: 50%;
          top: -10px;
          transform: translateX(-50%);
          width: 72px;
          height: 72px;
          z-index: 5;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          border-radius: 24px;
          background: linear-gradient(180deg, #8B78FF 0%, #6F58FF 100%);
          box-shadow: 0 6px 20px rgba(124, 104, 255, 0.35);
          border: 1px solid rgba(255, 255, 255, 0.1);
          cursor: pointer;
          -webkit-tap-highlight-color: transparent;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          text-decoration: none;
          gap: 1px;
        }

        .catalog-wrap::before,
        .catalog-wrap::after {
          display: none;
        }

        .catalog-wrap:active {
          transform: translateX(-50%) scale(0.92);
        }

        .catalog-wrap i {
          font-size: 22px;
          color: #fff;
        }

        .catalog-wrap span {
          font-size: 9px;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.95);
        }

        .nav-item {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 3px;
          text-decoration: none;
          position: relative;
          cursor: pointer;
          -webkit-tap-highlight-color: transparent;
          padding: 4px 0;
          transition: all 0.3s ease;
        }

        .nav-item:active {
          transform: scale(0.92);
        }

        .nav-item i {
          font-size: 20px;
          transition: all 0.3s ease;
        }

        .nav-item span {
          font-size: 10px;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .active-dot {
          position: absolute;
          bottom: 2px;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #7C68FF;
          box-shadow: 0 0 16px rgba(124, 104, 255, 0.6);
          transition: all 0.3s ease;
        }

        .nav-badge {
          position: absolute;
          top: -6px;
          right: -10px;
          min-width: 18px;
          height: 18px;
          padding: 0 5px;
          border-radius: 9999px;
          background: #FF453A;
          color: #fff;
          font-size: 9px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1.5px solid rgba(10, 10, 10, 0.4);
          box-shadow: 0 2px 8px rgba(255, 69, 58, 0.3);
        }

        .nav-badge.pulse {
          animation: badgePulse 2s ease-in-out infinite;
        }

        @keyframes badgePulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
      `}</style>

      <div className="nav-wrapper">
        <div className="catalog-bridge" />

        <Link to="/catalog" className="catalog-wrap">
          <i className="fas fa-store" />
          <span>Каталог</span>
        </Link>

        <div className="bottom-bar">
          <Link to="/" className="nav-item">
            <i className="fas fa-house" style={{
              color: getColor('/'),
              transform: isActive('/') ? 'scale(1.1)' : 'scale(1)'
            }} />
            <span style={{
              color: isActive('/') ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.35)',
              fontWeight: isActive('/') ? 600 : 500
            }}>
              Главная
            </span>
            {isActive('/') && <span className="active-dot" />}
          </Link>

          <Link to="/favorites" className="nav-item">
            <i className="fas fa-heart" style={{
              color: getColor('/favorites'),
              transform: isActive('/favorites') ? 'scale(1.1)' : 'scale(1)'
            }} />
            <span style={{
              color: isActive('/favorites') ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.35)',
              fontWeight: isActive('/favorites') ? 600 : 500
            }}>
              Избранное
            </span>
            {isActive('/favorites') && <span className="active-dot" />}
          </Link>

          <div style={{ width: 72, flexShrink: 0 }} />

          <Link to="/chat" className="nav-item">
            <span style={{ position: 'relative' }}>
              <i className="fas fa-comment-dots" style={{
                color: getColor('/chat'),
                transform: isActive('/chat') ? 'scale(1.1)' : 'scale(1)'
              }} />
              {unreadCount > 0 && (
                <span className={`nav-badge ${unreadCount > 0 ? 'pulse' : ''}`}>
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </span>
            <span style={{
              color: isActive('/chat') ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.35)',
              fontWeight: isActive('/chat') ? 600 : 500
            }}>
              Чат
            </span>
            {isActive('/chat') && <span className="active-dot" />}
          </Link>

          <Link to="/profile" className="nav-item">
            <i className="fas fa-user" style={{
              color: getColor('/profile'),
              transform: isActive('/profile') ? 'scale(1.1)' : 'scale(1)'
            }} />
            <span style={{
              color: isActive('/profile') ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.35)',
              fontWeight: isActive('/profile') ? 600 : 500
            }}>
              Профиль
            </span>
            {isActive('/profile') && <span className="active-dot" />}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MobileBottomNav;