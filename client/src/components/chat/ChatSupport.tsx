import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';

interface Message {
  id: number;
  userId: number;
  userName: string;
  message: string;
  isAdmin: boolean;
  timestamp: string;
  isRead: boolean;
}

const ChatSupport = () => {
  const { user, isAuthenticated } = useSelector((state: any) => state.auth);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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
      const allMessages = JSON.parse(localStorage.getItem('misat_chat_messages') || '[]');
      const userMessages = allMessages.filter((m: Message) => m.userId === user.id || m.isAdmin);
      setMessages(userMessages);

      const unread = userMessages.filter((m: Message) => m.isAdmin && !m.isRead);
      setUnreadCount(unread.length);
    }
  }, [isAuthenticated, user, isOpen]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  useEffect(() => {
    if (isOpen && isAuthenticated && user) {
      const allMessages = JSON.parse(localStorage.getItem('misat_chat_messages') || '[]');
      const updatedMessages = allMessages.map((m: Message) => {
        if (m.userId === user.id && m.isAdmin && !m.isRead) {
          return { ...m, isRead: true };
        }
        return m;
      });
      localStorage.setItem('misat_chat_messages', JSON.stringify(updatedMessages));
      setUnreadCount(0);

      const userMessages = updatedMessages.filter((m: Message) => m.userId === user.id || m.isAdmin);
      setMessages(userMessages);

      // Фокус на поле ввода при открытии
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, isAuthenticated, user]);

  const handleSendMessage = () => {
    if (!isAuthenticated) {
      toast.error('Войдите в аккаунт');
      return;
    }
    if (!inputMessage.trim()) return;

    const newMessage: Message = {
      id: Date.now(),
      userId: user.id,
      userName: user.first_name || user.email?.split('@')[0] || 'Пользователь',
      message: inputMessage,
      isAdmin: false,
      timestamp: new Date().toISOString(),
      isRead: false
    };

    const allMessages = JSON.parse(localStorage.getItem('misat_chat_messages') || '[]');
    allMessages.push(newMessage);
    localStorage.setItem('misat_chat_messages', JSON.stringify(allMessages));

    setMessages([...messages, newMessage]);
    setInputMessage('');
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

  // Группировка сообщений по датам
  const groupedMessages = () => {
    const groups: { [key: string]: Message[] } = {};
    messages.forEach(msg => {
      const dateKey = new Date(msg.timestamp).toDateString();
      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].push(msg);
    });
    return groups;
  };

  return (
    <>
      {/* Кнопка чата - тёмный стиль */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-white text-black rounded-full shadow-2xl flex items-center justify-center hover:scale-110 hover:bg-gray-100 transition-all duration-300 group"
      >
        <i className="fas fa-comment-dots text-xl"></i>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Окно чата */}
      {isOpen && (
        <>
          {!isMobile && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40" onClick={() => setIsOpen(false)} />
          )}

          <div
            className={`fixed bg-black border border-white/10 shadow-2xl overflow-hidden flex flex-col z-50 ${
              isMobile
                ? 'inset-0 rounded-none'
                : 'bottom-24 right-6 w-[380px] rounded-2xl'
            }`}
            style={{ height: isMobile ? 'auto' : '560px' }}
          >
            {/* Заголовок */}
            <div className="bg-black border-b border-white/10 p-4 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
                  <i className="fas fa-headset text-white/60 text-sm"></i>
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm">Поддержка MISAT</h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                    <span className="text-gray-500 text-[9px]">Online</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-white/10 transition"
              >
                <i className="fas fa-times text-gray-400 text-sm"></i>
              </button>
            </div>

            {/* Сообщения */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-black to-[#0a0a0a]">
              {messages.length === 0 ? (
                <div className="text-center py-10">
                  <div className="w-16 h-16 mx-auto bg-white/5 rounded-full flex items-center justify-center mb-3">
                    <i className="fas fa-comment-dots text-white/20 text-2xl"></i>
                  </div>
                  <p className="text-gray-500 text-sm">Нет сообщений</p>
                  <p className="text-gray-600 text-xs mt-1">Напишите нам, мы ответим!</p>
                </div>
              ) : (
                Object.entries(groupedMessages()).map(([dateKey, dateMessages]) => (
                  <div key={dateKey}>
                    <div className="text-center my-3">
                      <span className="text-[9px] text-gray-600 bg-white/5 px-2 py-0.5 rounded-full">
                        {formatDate(dateMessages[0].timestamp)}
                      </span>
                    </div>
                    {dateMessages.map(msg => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.isAdmin ? 'justify-start' : 'justify-end'}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                            msg.isAdmin
                              ? 'bg-white/10 text-white rounded-bl-sm'
                              : 'bg-white text-black rounded-br-sm'
                          }`}
                        >
                          {msg.isAdmin && (
                            <p className="text-[9px] font-medium text-gray-400 mb-1">Администратор</p>
                          )}
                          <p className="text-sm break-words">{msg.message}</p>
                          <p className={`text-[9px] mt-1 ${msg.isAdmin ? 'text-gray-500' : 'text-gray-500'}`}>
                            {formatTime(msg.timestamp)}
                            {!msg.isAdmin && (
                              <span className="ml-1">
                                <i className="fas fa-check text-[8px]"></i>
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Поле ввода */}
            <div className="border-t border-white/10 p-3 flex gap-2 bg-black shrink-0">
              <input
                ref={inputRef}
                type="text"
                placeholder="Напишите сообщение..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-gray-500 focus:border-white/30 focus:outline-none transition"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim()}
                className="w-10 h-10 bg-white text-black rounded-xl hover:bg-gray-100 transition flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <i className="fas fa-paper-plane text-sm"></i>
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default ChatSupport;