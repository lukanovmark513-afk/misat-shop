import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

interface Message {
  id: number;
  userId: number;
  userName: string;
  message: string;
  isAdmin: boolean;
  timestamp: string;
  isRead: boolean;
  images?: string[];
}

interface ChatSupportProps {
  isFullPage?: boolean;
}

// ============================================
// ЦВЕТОВАЯ ПАЛИТРА — тёмный архив
// ============================================
const COLORS = {
  bg: '#0a0a0b',
  bgCard: '#111113',
  bgElevated: '#161619',
  ink: '#e8e4dd',
  inkSoft: 'rgba(232, 228, 221, 0.62)',
  inkFaint: 'rgba(232, 228, 221, 0.38)',
  stamp: '#b8937a',
  stampDark: '#8b6f5a',
  olive: '#7a8a7a',
  rule: 'rgba(232, 228, 221, 0.08)',
  ruleStrong: 'rgba(232, 228, 221, 0.15)',
  gold: '#b8a088',
  goldLight: '#d4c4b0',
};

const ChatSupport = ({ isFullPage = false }: ChatSupportProps) => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state: any) => state.auth);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (isAuthenticated && user) {
      loadMessages();
    }
  }, [isAuthenticated, user]);

  const loadMessages = () => {
    if (isAuthenticated && user) {
      const allMessages = JSON.parse(localStorage.getItem('misat_chat_messages') || '[]');
      const userMessages = allMessages.filter((m: Message) => m.userId === user.id || m.isAdmin);
      setMessages(userMessages);
      const unread = userMessages.filter((m: Message) => m.isAdmin && !m.isRead);
      setUnreadCount(unread.length);
    }
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  useEffect(() => {
    if (isAuthenticated && user) {
      const allMessages = JSON.parse(localStorage.getItem('misat_chat_messages') || '[]');
      const updatedMessages = allMessages.map((m: Message) => {
        if (m.userId === user.id && m.isAdmin && !m.isRead) {
          return { ...m, isRead: true };
        }
        return m;
      });
      localStorage.setItem('misat_chat_messages', JSON.stringify(updatedMessages));
      setUnreadCount(0);
      loadMessages();
    }
  }, [isAuthenticated, user]);

  const compressImage = (file: File, maxSizeMB: number = 0.5): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          const maxWidth = 800;
          const maxHeight = 800;

          if (width > height) {
            if (width > maxWidth) {
              height = (height * maxWidth) / width;
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = (width * maxHeight) / height;
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);

          let quality = 0.7;
          let result = canvas.toDataURL('image/jpeg', quality);

          while (result.length > maxSizeMB * 1024 * 1024 && quality > 0.3) {
            quality -= 0.1;
            result = canvas.toDataURL('image/jpeg', quality);
          }

          resolve(result);
        };
        img.onerror = reject;
      };
      reader.onerror = reject;
    });
  };

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    if (selectedImages.length + files.length > 5) {
      toast.error('Максимум 5 фото на сообщение');
      return;
    }

    setIsUploading(true);

    try {
      const newImages: string[] = [];

      for (const file of files) {
        if (!file.type.startsWith('image/')) {
          toast.error('Можно загружать только изображения');
          continue;
        }

        if (file.size > 10 * 1024 * 1024) {
          toast.error(`Файл ${file.name} слишком большой. Максимум 10MB`);
          continue;
        }

        const compressed = await compressImage(file, 0.5);
        newImages.push(compressed);
      }

      setSelectedImages([...selectedImages, ...newImages]);
    } catch (error) {
      toast.error('Ошибка загрузки изображений');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const removeSelectedImage = (index: number) => {
    setSelectedImages(selectedImages.filter((_, i) => i !== index));
  };

  const handleSendMessage = () => {
    if (!isAuthenticated) {
      toast.error('Войдите в аккаунт');
      return;
    }
    if (!inputMessage.trim() && selectedImages.length === 0) return;

    const newMessage: Message = {
      id: Date.now(),
      userId: user.id,
      userName: user.first_name || user.email?.split('@')[0] || 'Пользователь',
      message: inputMessage,
      isAdmin: false,
      timestamp: new Date().toISOString(),
      isRead: false,
      images: selectedImages.length > 0 ? selectedImages : undefined
    };

    const allMessages = JSON.parse(localStorage.getItem('misat_chat_messages') || '[]');
    allMessages.push(newMessage);
    localStorage.setItem('misat_chat_messages', JSON.stringify(allMessages));

    setMessages([...messages, newMessage]);
    setInputMessage('');
    setSelectedImages([]);
    toast.success('Сообщение отправлено');
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Сегодня';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Вчера';
    } else {
      return date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' });
    }
  };

  const groupedMessages = () => {
    const groups: { [key: string]: Message[] } = {};
    messages.forEach(msg => {
      const dateKey = new Date(msg.timestamp).toDateString();
      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].push(msg);
    });
    return groups;
  };

  const MessageImages = ({ images }: { images: string[] }) => (
    <div className="flex flex-wrap gap-1.5 mt-2">
      {images.map((img, idx) => (
        <button
          key={idx}
          onClick={() => setIsPreviewOpen(img)}
          className={`relative overflow-hidden rounded-lg transition-all hover:scale-[1.02] ${
            images.length === 1 ? 'w-40 h-40' : 'w-20 h-20'
          }`}
          style={{ border: `1px solid ${COLORS.rule}` }}
        >
          <img src={img} alt={`Фото ${idx + 1}`} className="w-full h-full object-cover" loading="lazy" />
          {images.length > 1 && idx === 0 && (
            <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded text-[7px]" style={{ backgroundColor: 'rgba(10,10,11,0.8)', color: COLORS.ink, fontFamily: 'JetBrains Mono, monospace' }}>
              {images.length} ФОТО
            </span>
          )}
        </button>
      ))}
    </div>
  );

  const ImagePreviewModal = () => (
    isPreviewOpen && (
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(10, 10, 11, 0.97)',
          zIndex: 99999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem',
        }}
        onClick={() => setIsPreviewOpen(null)}
      >
        <button
          onClick={() => setIsPreviewOpen(null)}
          className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center text-xl"
          style={{ backgroundColor: COLORS.bgCard, color: COLORS.ink, border: `1px solid ${COLORS.rule}` }}
        >
          ✕
        </button>
        <img
          src={isPreviewOpen}
          alt="Превью"
          className="max-w-[90vw] max-h-[90vh] object-contain rounded"
          onClick={(e) => e.stopPropagation()}
        />
      </div>
    )
  );

  const renderMessages = () => {
    if (messages.length === 0) {
      return (
        <div className="text-center py-10">
          <div className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-3" style={{ backgroundColor: COLORS.bgCard, border: `1px solid ${COLORS.rule}` }}>
            <i className="fas fa-comment-dots text-2xl" style={{ color: COLORS.inkFaint }}></i>
          </div>
          <p className="text-sm" style={{ color: COLORS.inkSoft, fontFamily: 'JetBrains Mono, monospace' }}>Нет сообщений</p>
          <p className="text-xs mt-1" style={{ color: COLORS.inkFaint, fontFamily: 'JetBrains Mono, monospace' }}>Напишите нам, мы ответим!</p>
        </div>
      );
    }

    return Object.entries(groupedMessages()).map(([dateKey, dateMessages]) => (
      <div key={dateKey}>
        <div className="text-center my-3">
          <span className="text-[9px] px-2 py-0.5 rounded-full" style={{ color: COLORS.inkFaint, backgroundColor: COLORS.bgCard, fontFamily: 'JetBrains Mono, monospace' }}>
            {formatDate(dateMessages[0].timestamp)}
          </span>
        </div>
        {dateMessages.map(msg => (
          <div key={msg.id} className={`flex ${msg.isAdmin ? 'justify-start' : 'justify-end'} mb-2`}>
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 transition-all ${
                msg.isAdmin ? 'rounded-bl-sm' : 'rounded-br-sm'
              }`}
              style={{
                backgroundColor: msg.isAdmin ? COLORS.bgCard : `${COLORS.stamp}20`,
                border: `1px solid ${msg.isAdmin ? COLORS.rule : `${COLORS.stamp}40`}`,
              }}
            >
              {msg.isAdmin && (
                <p className="text-[9px] font-medium mb-1 flex items-center gap-1" style={{ color: COLORS.stamp, fontFamily: 'JetBrains Mono, monospace' }}>
                  <i className="fas fa-headset text-[8px]"></i> АДМИНИСТРАТОР
                </p>
              )}
              {msg.message && (
                <p className="text-sm break-words" style={{ color: COLORS.ink }}>{msg.message}</p>
              )}
              {msg.images && msg.images.length > 0 && (
                <MessageImages images={msg.images} />
              )}
              <p className="text-[9px] mt-1 flex items-center gap-1" style={{ color: COLORS.inkFaint, fontFamily: 'JetBrains Mono, monospace' }}>
                {formatTime(msg.timestamp)}
                {!msg.isAdmin && (
                  <i className="fas fa-check text-[8px]" style={{ color: COLORS.olive }}></i>
                )}
              </p>
            </div>
          </div>
        ))}
      </div>
    ));
  };

  const renderInputArea = () => (
    <div
      className="p-3 flex flex-col gap-2 shrink-0"
      style={{
        backgroundColor: COLORS.bg,
        borderTop: `1px solid ${COLORS.rule}`,
        paddingBottom: '0.75rem',
      }}
    >
      {selectedImages.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedImages.map((img, idx) => (
            <div key={idx} className="relative">
              <img src={img} alt="Выбранное" className="w-16 h-16 object-cover rounded-lg" style={{ border: `1px solid ${COLORS.rule}` }} />
              <button
                onClick={() => removeSelectedImage(idx)}
                className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center text-[8px]"
                style={{ backgroundColor: '#8a4a4a', color: '#fff' }}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-2">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageSelect}
          className="hidden"
          disabled={isUploading}
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="w-10 h-10 rounded-xl flex items-center justify-center transition-all disabled:opacity-40 shrink-0"
          style={{ backgroundColor: COLORS.bgCard, border: `1px solid ${COLORS.rule}`, color: COLORS.inkSoft }}
          title="Прикрепить фото"
        >
          {isUploading ? (
            <div className="w-4 h-4 border-2 rounded-full animate-spin" style={{ borderColor: COLORS.rule, borderTopColor: COLORS.stamp }}></div>
          ) : (
            <i className="fas fa-paperclip text-sm"></i>
          )}
        </button>
        <input
          ref={inputRef}
          type="text"
          placeholder="Сообщение..."
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          className="flex-1 min-w-0 px-4 py-2.5 rounded-xl text-sm transition-all"
          style={{
            backgroundColor: COLORS.bgCard,
            border: `1px solid ${COLORS.rule}`,
            color: COLORS.ink,
            outline: 'none',
            fontFamily: 'JetBrains Mono, monospace',
          }}
        />
        <button
          onClick={handleSendMessage}
          disabled={!inputMessage.trim() && selectedImages.length === 0}
          className="w-10 h-10 rounded-xl flex items-center justify-center transition-all disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
          style={{
            backgroundColor: inputMessage.trim() || selectedImages.length > 0 ? COLORS.ink : COLORS.bgCard,
            border: `1px solid ${inputMessage.trim() || selectedImages.length > 0 ? COLORS.ink : COLORS.rule}`,
            color: inputMessage.trim() || selectedImages.length > 0 ? COLORS.bg : COLORS.inkFaint,
          }}
        >
          <i className="fas fa-paper-plane text-sm"></i>
        </button>
      </div>
    </div>
  );

  const previewModal = <ImagePreviewModal />;

  // ============================================
  // МОБИЛЬНАЯ ВЕРСИЯ — БОЛЬШЕ ОТСТУПЫ
  // ============================================
  if (isMobile) {
    return (
      <>
        {/* Чат на весь экран */}
        <div
          className="flex flex-col"
          style={{
          backgroundColor: COLORS.bg,
          position: 'fixed',
          top: '-1px', // На 1px выше шапки
          left: 0,
          right: 0,
          bottom: 0,
          width: '100%',
          height: 'calc(100% + 1px)', // Компенсируем поднятие
          zIndex: 1,
          }}
        >
          {/* Больше отступ сверху для шапки */}
          <div style={{ height: '70px', flexShrink: 0 }} />

          {/* Заголовок чата */}
          <div
            className="px-4 py-3 flex items-center gap-2 shrink-0"
            style={{
              backgroundColor: COLORS.bgCard,
              borderBottom: `1px solid ${COLORS.rule}`,
            }}
          >
            <button
              onClick={() => navigate('/')}
              className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 active:scale-95 transition"
              style={{ backgroundColor: COLORS.bg, border: `1px solid ${COLORS.rule}`, color: COLORS.ink }}
              aria-label="Назад"
            >
              <i className="fas fa-arrow-left text-sm"></i>
            </button>
            <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: COLORS.bg, border: `1px solid ${COLORS.rule}` }}>
              <i className="fas fa-headset text-sm" style={{ color: COLORS.stamp }}></i>
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-bold truncate" style={{ color: COLORS.ink, fontFamily: 'JetBrains Mono, monospace' }}>
                ПОДДЕРЖКА MISAT
              </h3>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: COLORS.olive }}></span>
                <span className="text-[9px]" style={{ color: COLORS.inkFaint, fontFamily: 'JetBrains Mono, monospace' }}>ONLINE</span>
              </div>
            </div>
          </div>

          {/* Сообщения с большим отступом снизу */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3" style={{ flex: 1, minHeight: 0, paddingBottom: '90px' }}>
            {renderMessages()}
            <div ref={messagesEndRef} />
          </div>

          {/* Поле ввода с большим отступом снизу */}
          <div style={{ paddingBottom: '90px' }}>
            {renderInputArea()}
          </div>
        </div>

        {/* Превью */}
        {previewModal}
      </>
    );
  }

  // ============================================
  // ДЕСКТОПНАЯ ВЕРСИЯ — КАК БЫЛО
  // ============================================
  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 hover:scale-105"
        style={{
          backgroundColor: `${COLORS.stamp}20`,
          border: `1px solid ${COLORS.stamp}50`,
          color: COLORS.stamp,
          boxShadow: '0 8px 30px rgba(0,0,0,0.5)',
        }}
      >
        <i className="fas fa-comment-dots text-xl"></i>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold animate-pulse" style={{ backgroundColor: '#8a4a4a', color: '#fff' }}>
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" style={{ backgroundColor: 'rgba(10,10,11,0.8)' }} onClick={() => setIsOpen(false)} />
          <div
            className="fixed bottom-24 right-6 w-[380px] overflow-hidden flex flex-col z-50 rounded-2xl"
            style={{
              height: '560px',
              backgroundColor: COLORS.bg,
              border: `1px solid ${COLORS.ruleStrong}`,
              boxShadow: '0 20px 60px rgba(0,0,0,0.7)',
            }}
          >
            <div
              className="p-4 flex justify-between items-center shrink-0"
              style={{ backgroundColor: COLORS.bgCard, borderBottom: `1px solid ${COLORS.rule}` }}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: COLORS.bg, border: `1px solid ${COLORS.rule}` }}>
                  <i className="fas fa-headset text-sm" style={{ color: COLORS.stamp }}></i>
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-bold truncate" style={{ color: COLORS.ink, fontFamily: 'JetBrains Mono, monospace' }}>
                    ПОДДЕРЖКА MISAT
                  </h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: COLORS.olive }}></span>
                    <span className="text-[9px]" style={{ color: COLORS.inkFaint, fontFamily: 'JetBrains Mono, monospace' }}>ONLINE</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="w-7 h-7 flex items-center justify-center rounded-full transition shrink-0" style={{ color: COLORS.inkFaint }}>
                <i className="fas fa-times text-sm"></i>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ flex: 1, minHeight: 0 }}>
              {renderMessages()}
              <div ref={messagesEndRef} />
            </div>

            {renderInputArea()}
          </div>
        </>
      )}
    </>
  );
};

export default ChatSupport;