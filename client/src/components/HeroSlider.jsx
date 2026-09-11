// components/HeroSlider.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';

const HeroSlider = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const autoplayRef = useRef(null);
  const touchTimeoutRef = useRef(null);

  // Для мобильных слайдов - новые бренды
  const mobileSlides = [
    {
      id: 1,
      title: 'GUCCI',
      subtitle: '',
      btnText: 'ИССЛЕДОВАТЬ',
      btnLink: '/catalog?brand=gucci',
      image: '/images/brands/gucci.jpg',
      btnStyle: 'gold'
    },
    {
      id: 2,
      title: 'STONE ISLAND',
      subtitle: '',
      btnText: 'СМОТРЕТЬ КОЛЛЕКЦИЮ',
      btnLink: '/catalog?brand=chorme',
      image: '/images/brands/stoneis.jpg',
      btnStyle: 'silver'
    },
    {
      id: 3,
      title: 'NIKE',
      subtitle: '',
      btnText: 'КУПИТЬ СЕЙЧАС',
      btnLink: '/catalog?brand=nike',
      image: '/images/brands/nike_m.jpg',
      btnStyle: 'white'
    },
    {
      id: 4,
      title: 'THE NORTH FACE',
      subtitle: '',
      btnText: 'ОТКРЫТЬ',
      btnLink: '/catalog?brand=tnf',
      image: '/images/brands/thent.jpg',
      btnStyle: 'explore'
    }
  ];

  // Для ПК - оставляем как было
  const desktopSlides = [
    {
      id: 1,
      title: 'ADIDAS',
      subtitle: 'IMPOSSIBLE IS NOTHING',
      btnText: 'СМОТРЕТЬ',
      btnLink: '/catalog?brand=adidas',
      image: '/images/brands/adidas.jpg'
    },
    {
      id: 2,
      title: 'NIKE',
      subtitle: 'JUST DO IT',
      btnText: 'КУПИТЬ',
      btnLink: '/catalog?brand=nike',
      image: '/images/brands/nike.jpg'
    },
    {
      id: 3,
      title: 'BALENCIAGA',
      subtitle: 'LUXURY STREETWEAR',
      btnText: 'ВЫБРАТЬ',
      btnLink: '/catalog?brand=balenciaga',
      image: '/images/brands/balenciaga.jpg'
    },
    {
      id: 4,
      title: 'RAF SIMONS',
      subtitle: 'AVANT-GARDE',
      btnText: 'ПОСМОТРЕТЬ',
      btnLink: '/catalog?brand=raf-simons',
      image: '/images/brands/raf_simons.jpg'
    }
  ];

  // Определяем мобильное устройство
  const [isMobile, setIsMobile] = useState(false);
  const slides = isMobile ? mobileSlides : desktopSlides;

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const startAutoplay = useCallback(() => {
    if (autoplayRef.current) clearInterval(autoplayRef.current);
    autoplayRef.current = setInterval(() => {
      setActiveSlide(prev => (prev + 1) % slides.length);
    }, 5000);
  }, [slides.length]);

  const stopAutoplay = useCallback(() => {
    if (autoplayRef.current) clearInterval(autoplayRef.current);
  }, []);

  useEffect(() => {
    startAutoplay();
    return () => stopAutoplay();
  }, [startAutoplay, stopAutoplay]);

  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
    stopAutoplay();
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) {
      startAutoplay();
      return;
    }

    const diff = touchStart - touchEnd;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        setActiveSlide(prev => (prev + 1) % slides.length);
      } else {
        setActiveSlide(prev => (prev - 1 + slides.length) % slides.length);
      }
    }

    setTouchStart(0);
    setTouchEnd(0);

    if (touchTimeoutRef.current) clearTimeout(touchTimeoutRef.current);
    touchTimeoutRef.current = setTimeout(() => startAutoplay(), 3000);
  };

  const nextSlide = () => {
    setActiveSlide(prev => (prev + 1) % slides.length);
    stopAutoplay();
    startAutoplay();
  };

  const prevSlide = () => {
    setActiveSlide(prev => (prev - 1 + slides.length) % slides.length);
    stopAutoplay();
    startAutoplay();
  };

  const getButtonStyle = (btnStyle) => {
    switch (btnStyle) {
      case 'gold':
        return 'bg-transparent border-2 border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black';
      case 'silver':
        return 'bg-transparent border-2 border-gray-400 text-gray-400 hover:bg-gray-400 hover:text-black';
      case 'white':
        return 'bg-transparent border-2 border-white text-white hover:bg-white hover:text-black';
      case 'explore':
        return 'bg-transparent border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white';
      default:
        return 'bg-white text-black hover:bg-gray-100';
    }
  };

  return (
    <div
      className="relative h-[50vh] min-h-[400px] md:h-[60vh] md:min-h-[500px] w-full overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {slides.map((slide, index) => {
        let translateX = '100%';
        if (activeSlide === index) {
          translateX = '0';
        } else if (activeSlide > index) {
          translateX = '-100%';
        }

        return (
          <div
            key={slide.id}
            className="absolute inset-0 transition-transform duration-500 md:duration-700 ease-out will-change-transform"
            style={{
              transform: `translateX(${translateX})`,
              zIndex: activeSlide === index ? 10 : 0
            }}
          >
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url(${slide.image})`,
                backgroundPosition: 'top center',
                backgroundSize: 'cover'
              }}
            />

            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-24 md:h-56 bg-gradient-to-t from-black via-black/80 to-transparent" />

            <div className="relative h-full flex flex-col items-center justify-end text-center px-4 md:px-6 pb-12 md:pb-20">
              <div className="max-w-[260px] md:max-w-[500px]">
                {slide.subtitle && (
                  <p className="text-white/50 text-[8px] md:text-[11px] tracking-[0.2em] md:tracking-[0.3em] mb-2 md:mb-3 uppercase font-light">
                    {slide.subtitle}
                  </p>
                )}
                <h1 className="text-3xl md:text-6xl lg:text-7xl font-['Bebas_Neue'] font-black text-white tracking-wide mb-3 md:mb-6 leading-[1.05]">
                  {slide.title}
                </h1>
                <Link
                  to={slide.btnLink}
                  className={`inline-flex items-center justify-center gap-2 px-6 md:px-10 py-2.5 md:py-3 text-[11px] md:text-sm font-bold rounded-full transition-all duration-300 hover:scale-105 active:scale-95 ${getButtonStyle(slide.btnStyle)}`}
                >
                  <span>{slide.btnText}</span>
                  <svg className="w-3.5 h-3.5 md:w-4 md:h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        );
      })}

      {/* СТРЕЛКИ НАВИГАЦИИ - видны на всех устройствах */}
      <button
        onClick={prevSlide}
        className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 md:w-10 md:h-10 rounded-full bg-black/40 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/60 hover:scale-110 transition-all duration-300"
        aria-label="Предыдущий слайд"
      >
        <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 md:w-10 md:h-10 rounded-full bg-black/40 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/60 hover:scale-110 transition-all duration-300"
        aria-label="Следующий слайд"
      >
        <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
};

export default HeroSlider;