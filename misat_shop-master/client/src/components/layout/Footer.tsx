import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  // Полные ссылки для ПК
  const links = {
    catalog: [
      { to: '/catalog?category=clothes', label: 'Одежда' },
      { to: '/catalog?category=shoes', label: 'Обувь' },
      { to: '/catalog?category=accessories', label: 'Аксессуары' },
      { to: '/catalog?category=sport', label: 'Спорт' },
      { to: '/catalog?category=sale', label: 'Распродажа', sale: true }
    ],
    info: [
      { to: '/about', label: 'О магазине' },
      { to: '/delivery', label: 'Доставка и оплата' },
      { to: '/returns', label: 'Возврат товара' },
      { to: '/faq', label: 'Вопросы и ответы' },
      { to: '/blog', label: 'Блог' }
    ],
    support: [
      { to: '/support', label: 'Служба поддержки' },
      { to: '/contacts', label: 'Контакты' },
      { to: '/tracking', label: 'Отследить заказ' },
      { to: '/gift-card', label: 'Подарочные сертификаты' }
    ]
  };

  const socials = [
    { href: 'https://www.tiktok.com/@misatchina', icon: 'fa-tiktok' },
    { href: 'https://vk.ru/mokidorastore', icon: 'fa-vk' },
    { href: 'https://t.me/misatshop', icon: 'fa-telegram' }
  ];

  const payments = ['fa-cc-visa', 'fa-cc-mastercard', 'fa-cc-mir', 'fa-cc-apple-pay', 'fa-cc-paypal'];

  // Короткие ссылки для мобильной версии
  const mobileNavLinks = [
    { to: '/catalog', label: 'Каталог' },
    { to: '/about', label: 'О нас' },
    { to: '/delivery', label: 'Доставка' },
    { to: '/contacts', label: 'Контакты' }
  ];

  return (
    <footer style={{
      background: 'linear-gradient(to bottom, rgba(10,10,10,0.8), #000)',
      borderTop: '1px solid rgba(255,255,255,0.06)'
    }}>

      {/* ========== МОБИЛЬНАЯ ВЕРСИЯ (до 768px) ========== */}
      <div className="md:hidden px-4 pt-6 pb-20 text-center">
        <Link to="/" style={{
          display: 'inline-block',
          fontSize: '16px',
          fontWeight: 600,
          letterSpacing: '-0.04em',
          color: 'rgba(255,255,255,0.5)',
          textDecoration: 'none',
          transition: 'color 0.2s ease'
        }}
        onMouseEnter={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.8)'}
        onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}
        >
          MISAT
        </Link>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 16,
          marginTop: 8
        }}>
          {mobileNavLinks.map((link) => (
            <Link key={link.to} to={link.to} style={{
              color: 'rgba(255,255,255,0.3)',
              fontSize: '10px',
              textDecoration: 'none',
              fontWeight: 500,
              letterSpacing: '0.02em',
              transition: 'color 0.2s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.3)'}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>

      {/* ========== ПК ВЕРСИЯ (от 768px) ========== */}
      <div className="hidden md:block px-4 md:px-6 lg:px-8 py-10">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">

            {/* Brand - iOS Style */}
            <div className="col-span-2 md:col-span-1">
              <Link to="/" style={{
                display: 'inline-block',
                marginBottom: 12,
                textDecoration: 'none'
              }}>
                <span style={{
                  fontSize: '24px',
                  fontWeight: 600,
                  letterSpacing: '-0.04em',
                  color: '#fff'
                }}>MISAT</span>
              </Link>
              <p style={{
                color: 'rgba(255,255,255,0.3)',
                fontSize: '13px',
                marginBottom: 12,
                fontWeight: 400
              }}>Минимализм. Качество. Стиль.</p>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 4,
                fontSize: '11px',
                color: 'rgba(255,255,255,0.25)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <i className="fas fa-map-marker-alt" style={{ color: 'rgba(255,255,255,0.2)', fontSize: '10px' }} />
                  <span>Смоленск, Россия</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <i className="fas fa-envelope" style={{ color: 'rgba(255,255,255,0.2)', fontSize: '10px' }} />
                  <a href="mailto:info@misat.ru" style={{
                    color: 'rgba(255,255,255,0.25)',
                    textDecoration: 'none',
                    transition: 'color 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.25)'}
                  >
                    info@misat.ru
                  </a>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <i className="fas fa-phone" style={{ color: 'rgba(255,255,255,0.2)', fontSize: '10px' }} />
                  <a href="tel:+79938843766" style={{
                    color: 'rgba(255,255,255,0.25)',
                    textDecoration: 'none',
                    transition: 'color 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.25)'}
                  >
                    +7 (993) 884-37-66
                  </a>
                </div>
              </div>
            </div>

            {/* Каталог */}
            <div>
              <h4 style={{
                fontWeight: 600,
                marginBottom: 12,
                fontSize: '10px',
                letterSpacing: '0.2em',
                color: 'rgba(255,255,255,0.3)',
                textTransform: 'uppercase'
              }}>Каталог</h4>
              <ul style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 6,
                listStyle: 'none',
                padding: 0,
                margin: 0
              }}>
                {links.catalog.map(link => (
                  <li key={link.to}>
                    <Link to={link.to} style={{
                      color: link.sale ? 'rgba(255,69,58,0.7)' : 'rgba(255,255,255,0.4)',
                      fontSize: '13px',
                      textDecoration: 'none',
                      fontWeight: 400,
                      transition: 'color 0.2s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = link.sale ? 'rgba(255,69,58,0.9)' : 'rgba(255,255,255,0.7)'}
                    onMouseLeave={(e) => e.currentTarget.style.color = link.sale ? 'rgba(255,69,58,0.7)' : 'rgba(255,255,255,0.4)'}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Информация */}
            <div>
              <h4 style={{
                fontWeight: 600,
                marginBottom: 12,
                fontSize: '10px',
                letterSpacing: '0.2em',
                color: 'rgba(255,255,255,0.3)',
                textTransform: 'uppercase'
              }}>Информация</h4>
              <ul style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 6,
                listStyle: 'none',
                padding: 0,
                margin: 0
              }}>
                {links.info.map(link => (
                  <li key={link.to}>
                    <Link to={link.to} style={{
                      color: 'rgba(255,255,255,0.4)',
                      fontSize: '13px',
                      textDecoration: 'none',
                      fontWeight: 400,
                      transition: 'color 0.2s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Поддержка */}
            <div>
              <h4 style={{
                fontWeight: 600,
                marginBottom: 12,
                fontSize: '10px',
                letterSpacing: '0.2em',
                color: 'rgba(255,255,255,0.3)',
                textTransform: 'uppercase'
              }}>Поддержка</h4>
              <ul style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 6,
                listStyle: 'none',
                padding: 0,
                margin: 0
              }}>
                {links.support.map(link => (
                  <li key={link.to}>
                    <Link to={link.to} style={{
                      color: 'rgba(255,255,255,0.4)',
                      fontSize: '13px',
                      textDecoration: 'none',
                      fontWeight: 400,
                      transition: 'color 0.2s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Соцсети и оплата - iOS Style */}
            <div>
              <h4 style={{
                fontWeight: 600,
                marginBottom: 12,
                fontSize: '10px',
                letterSpacing: '0.2em',
                color: 'rgba(255,255,255,0.3)',
                textTransform: 'uppercase'
              }}>Мы в соцсетях</h4>
              <div style={{
                display: 'flex',
                gap: 10,
                marginBottom: 16
              }}>
                {socials.map(social => (
                  <a
                    key={social.icon}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      background: 'rgba(255,255,255,0.04)',
                      backdropFilter: 'blur(20px)',
                      border: '1px solid rgba(255,255,255,0.06)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'rgba(255,255,255,0.3)',
                      fontSize: '16px',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)';
                      e.currentTarget.style.color = 'rgba(255,255,255,0.7)';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                      e.currentTarget.style.color = 'rgba(255,255,255,0.3)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <i className={`fab ${social.icon}`}></i>
                  </a>
                ))}
              </div>

              <h4 style={{
                fontWeight: 600,
                marginBottom: 8,
                fontSize: '10px',
                letterSpacing: '0.2em',
                color: 'rgba(255,255,255,0.3)',
                textTransform: 'uppercase'
              }}>Принимаем к оплате</h4>
              <div style={{
                display: 'flex',
                gap: 8,
                fontSize: '18px'
              }}>
                {payments.map(payment => (
                  <i key={payment} className={`fab ${payment}`} style={{
                    color: 'rgba(255,255,255,0.2)',
                    transition: 'color 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.2)'}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Реквизиты и копирайт - iOS Style */}
          <div style={{
            borderTop: '1px solid rgba(255,255,255,0.04)',
            paddingTop: 20,
            textAlign: 'center',
            fontSize: '11px',
            color: 'rgba(255,255,255,0.15)'
          }}>
            <p style={{ margin: '0 0 4px' }}>MISAT | ИНН: 673111219228 | Режим налогообложения: Самозанятый</p>
            <p style={{ margin: '0 0 8px' }}>© {currentYear} MISAT. Все права защищены.</p>
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: 16,
              flexWrap: 'wrap'
            }}>
              <Link to="/privacy" style={{
                color: 'rgba(255,255,255,0.15)',
                textDecoration: 'none',
                fontSize: '11px',
                transition: 'color 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.3)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.15)'}
              >
                Политика конфиденциальности
              </Link>
              <Link to="/terms" style={{
                color: 'rgba(255,255,255,0.15)',
                textDecoration: 'none',
                fontSize: '11px',
                transition: 'color 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.3)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.15)'}
              >
                Пользовательское соглашение
              </Link>
              <Link to="/offer" style={{
                color: 'rgba(255,255,255,0.15)',
                textDecoration: 'none',
                fontSize: '11px',
                transition: 'color 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.3)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.15)'}
              >
                Публичная оферта
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;