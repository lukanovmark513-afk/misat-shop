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

  // Проверка на мобильное устройство
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Загрузка сообщений
  useEffect(() => {
    if (isAuthenticated && user) {
      const allMessages = JSON.parse(localStorage.getItem('misat_chat_messages') || '[]');
      const userMessages = allMessages.filter((m: Message) => m.userId === user.id || m.isAdmin);
      setMessages(userMessages);

      const unread = userMessages.filter((m: Message) => m.isAdmin && !m.isRead);
      setUnreadCount(unread.length);
    }
  }, [isAuthenticated, user, isOpen]);

  // Автоскролл
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Отметить прочитанные при открытии
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

  return (
    <>
      {/* Кнопка чата */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-black text-white w-14 h-14 rounded-full shadow-lg hover:bg-gray-800 transition-all hover:scale-110 z-50 flex items-center justify-center"
      >
        <i className="fas fa-comment-dots text-2xl"></i>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Окно чата */}
      {isOpen && (
        <>
          {/* Затемнение только на ПК */}
          {!isMobile && (
            <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setIsOpen(false)} />
          )}

          {/* Контейнер чата */}
          <div
            className={`fixed bg-white shadow-2xl overflow-hidden flex flex-col z-50 ${
              isMobile
                ? 'inset-0 rounded-none'
                : 'bottom-24 right-6 w-96 rounded-2xl'
            }`}
            style={{ height: isMobile ? 'auto' : '500px' }}
          >
            {/* Заголовок */}
            <div className="bg-black text-white p-4 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-2">
                <i className="fas fa-headset"></i>
                <h3 className="font-black">Поддержка MISAT</h3>
                <span className="text-xs bg-green-500 px-2 py-0.5 rounded-full ml-2">Online</span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            {/* Сообщения */}
            <div className="overflow-y-auto p-4 bg-gray-50 flex flex-col gap-3 flex-1">
              {messages.length === 0 ? (
                <div className="text-center text-gray-500 py-10">
                  <i className="fas fa-comment-dots text-4xl mb-2"></i>
                  <p>Нет сообщений</p>
                  <p className="text-sm">Напишите нам, мы ответим!</p>
                </div>
              ) : (
                messages.map(msg => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.isAdmin ? 'justify-start' : 'justify-end'}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-2xl ${
                        msg.isAdmin
                          ? 'bg-white border border-gray-200'
                          : 'bg-black text-white'
                      }`}
                    >
                      {msg.isAdmin && (
                        <p className="text-xs font-bold text-gray-500 mb-1">Администратор</p>
                      )}
                      <p className="text-sm break-words">{msg.message}</p>
                      <p className={`text-xs mt-1 ${msg.isAdmin ? 'text-gray-400' : 'text-gray-300'}`}>
                        {formatTime(msg.timestamp)}
                      </p>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Поле ввода */}
            <div className="border-t p-3 flex gap-2 bg-white shrink-0">
              <input
                type="text"
                placeholder="Напишите сообщение..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1 px-4 py-2 border border-gray-200 rounded-full text-sm focus:outline-none focus:border-black"
              />
              <button
                onClick={handleSendMessage}
                className="bg-black text-white w-10 h-10 rounded-full hover:bg-gray-800 transition flex items-center justify-center"
              >
                <i className="fas fa-paper-plane"></i>
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default ChatSupport;