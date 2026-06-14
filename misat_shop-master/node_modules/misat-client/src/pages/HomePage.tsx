import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { productsAPI } from '../services/api';

// Импортируем компоненты
import HomePageDesktop from './HomePageDesktop';
import MobileHomePage from './MobileHomePage';

const HomePage = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useAppDispatch();
  const favorites = useAppSelector((state) => state.favorites.items);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      setIsInitialized(true);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await productsAPI.getAll();
        setProducts(response.data.slice(0, 8));
      } catch (error) {
        console.error('Ошибка загрузки:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadProducts();
  }, []);

  if (!isInitialized || isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-gray-500 text-sm">ЗАГРУЗКА</p>
        </div>
      </div>
    );
  }

  // Передаём данные через пропсы
  const commonProps = {
    products,
    favorites,
    dispatch,
    isLoading
  };

  return isMobile ? (
    <MobileHomePage {...commonProps} />
  ) : (
    <HomePageDesktop {...commonProps} />
  );
};

export default HomePage;