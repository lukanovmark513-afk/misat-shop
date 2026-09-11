// client/src/components/AnimatedEntry.tsx
"use client";

import React, { useState, useEffect } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";

interface AnimatedEntryProps {
  children: React.ReactNode;
  duration?: number;
}

const AnimatedEntry: React.FC<AnimatedEntryProps> = ({ children, duration = 2800 }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [displayText, setDisplayText] = useState("");

  const fullText = "WELCOME RUSSIA!";

  // Анимация печати текста
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i <= fullText.length) {
        setDisplayText(fullText.slice(0, i));
        i++;
      } else {
        clearInterval(interval);
      }
    }, 100);
    return () => clearInterval(interval);
  }, []);

  // Определяем мобильное устройство
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const bgImage = isMobile ? '/images/misat_mb.png' : '/images/misat-wallpaper.png';

  // Параллакс
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const imageX = useTransform(mouseX, [-500, 500], isMobile ? [-5, 5] : [-8, 8]);
  const imageY = useTransform(mouseY, [-300, 300], isMobile ? [-3, 3] : [-6, 6]);

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isMobile) return;
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left - rect.width / 2);
    mouseY.set(e.clientY - rect.top - rect.height / 2);
  };

  useEffect(() => {
    const stepTime = duration / 50;
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 2;
      });
    }, stepTime);

    const timer = setTimeout(() => setIsLoading(false), duration);
    return () => {
      clearInterval(progressInterval);
      clearTimeout(timer);
    };
  }, [duration]);

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-[9999] bg-black overflow-hidden">
        <div
          onMouseMove={handleMove}
          className="relative h-full w-full flex items-center justify-center"
        >
          {/* Чёрный фон */}
          <div className="absolute inset-0 bg-black" />

          {/* Фоновое изображение */}
          <motion.div
            style={{ x: imageX, y: imageY }}
            className="absolute inset-8 md:inset-16"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: imageLoaded ? 1 : 0, scale: imageLoaded ? 1 : 0.98 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <img
              src={bgImage}
              alt="MISAT Loading"
              onLoad={() => setImageLoaded(true)}
              className="w-full h-full object-contain"
            />
          </motion.div>

          {imageLoaded && (
            <>
              <motion.div
                className="absolute inset-8 md:inset-16"
                animate={{ scale: isMobile ? [1, 1.005] : [1, 1.008] }}
                transition={{ scale: { duration: 25, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" } }}
              />
              <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/60 pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/30 pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20 pointer-events-none" />
              <motion.div
                animate={{ x: ["-100%", "100%"] }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/3 to-transparent blur-3xl pointer-events-none"
              />
            </>
          )}

          {/* НАДПИСЬ WELCOME RUSSIA! И ФЛАГ ВМЕСТО ПРОГРЕССА */}
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-10 text-center w-full px-6">
            {/* Печатающийся текст */}
            <div className="text-white/60 text-sm md:text-base tracking-wider mb-4 font-mono">
              {displayText}
              {displayText.length < fullText.length && (
                <span className="inline-block w-0.5 h-4 bg-white/40 ml-0.5 align-middle animate-pulse" />
              )}
            </div>

            {/* Линия под текстом */}
            {displayText.length === fullText.length && (
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.6 }}
                className="w-32 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent mx-auto mb-5"
              />
            )}

            {/* ФЛАГ РОССИИ вместо полосы загрузки */}
            <div className="flex justify-center">
              <div className="flex flex-col items-center gap-1">
                <div className="flex">
                  <div className="w-8 h-2 bg-white"></div>
                  <div className="w-8 h-2 bg-blue-600"></div>
                  <div className="w-8 h-2 bg-red-600"></div>
                </div>
                <div className="text-white/20 text-[7px] tracking-[0.2em] mt-1">
                  {String(progress).padStart(3, '0')}
                </div>
              </div>
            </div>
          </div>

          {/* Частицы */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(30)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: [0, 0.3, 0],
                  scale: [0, 1, 0],
                  x: Math.random() * 100 - 50,
                  y: Math.random() * 100 - 50,
                }}
                transition={{
                  duration: Math.random() * 3 + 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
                className="absolute w-0.5 h-0.5 bg-white/20 rounded-full"
                style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
              />
            ))}
          </div>

          {/* Glow снизу */}
          <motion.div
            animate={{ opacity: [0.02, 0.05, 0.02], scale: [1, 1.08, 1] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute left-1/2 bottom-0 w-[400px] h-[200px] -translate-x-1/2 bg-gradient-to-t from-white/5 to-transparent rounded-full blur-3xl pointer-events-none"
          />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedEntry;