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

interface UserChat {
  userId: number;
  userName: string;
  email: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  messages: Message[];
}

const AdminChat = () => {
  const { user } = useSelector((state: any) => state.auth);
  const [users, setUsers] = useState<UserChat[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserChat | null>(null);
  const [inputMessage, setInputMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Загрузка всех сообщений и группировка по пользователям
  useEffect(() => {
    loadChats();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedUser?.messages]);

  const loadChats = () => {
    const allMessages: Message[] = JSON.parse(localStorage.getItem('misat_chat_messages') || '[]');
    const allUsers = JSON.parse(localStorage.getItem('misat_users') || '[]');

    // Группируем сообщения по пользователям
    const userMap = new Map<number, UserChat>();

    allMessages.forEach(msg => {
      if (!userMap.has(msg.userId)) {
        const userInfo = allUsers.find((u: any) => u.id === msg.userId);
        userMap.set(msg.userId, {
          userId: msg.userId,
          userName: userInfo?.first_name || userInfo?.email?.split('@')[0] || 'Пользователь',
          email: userInfo?.email || '',
          lastMessage: msg.message,
          lastMessageTime: msg.timestamp,
          unreadCount: 0,
          messages: []
        });
      }

      const chat = userMap.get(msg.userId)!;
      chat.messages.push(msg);
      chat.lastMessage = msg.message;
      chat.lastMessageTime = msg.timestamp;

      // Считаем непрочитанные сообщения от пользователя
      if (!msg.isAdmin && !msg.isRead) {
        chat.unreadCount++;
      }
    });

    // Сортируем по времени последнего сообщения
    const sortedUsers = Array.from(userMap.values()).sort((a, b) =>
      new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime()
    );

    setUsers(sortedUsers);
  };

  const handleSendMessage = () => {
    if (!selectedUser) return;
    if (!inputMessage.trim()) return;

    const newMessage: Message = {
      id: Date.now(),
      userId: selectedUser.userId,
      userName: 'Admin',
      message: inputMessage,
      isAdmin: true,
      timestamp: new Date().toISOString(),
      isRead: true
    };

    const allMessages = JSON.parse(localStorage.getItem('misat_chat_messages') || '[]');
    allMessages.push(newMessage);
    localStorage.setItem('misat_chat_messages', JSON.stringify(allMessages));

    // Обновляем локальное состояние
    const updatedMessages = [...selectedUser.messages, newMessage];
    setSelectedUser({ ...selectedUser, messages: updatedMessages, lastMessage: inputMessage, lastMessageTime: newMessage.timestamp });

    // Обновляем список чатов
    const updatedUsers = users.map(u =>
      u.userId === selectedUser.userId
        ? { ...u, lastMessage: inputMessage, lastMessageTime: newMessage.timestamp, unreadCount: 0 }
        : u
    );
    setUsers(updatedUsers);

    setInputMessage('');
    toast.success('Сообщение отправлено');
  };

  const selectUser = (userChat: UserChat) => {
    // Отмечаем все сообщения от пользователя как прочитанные
    const allMessages = JSON.parse(localStorage.getItem('misat_chat_messages') || '[]');
    const updatedMessages = allMessages.map((msg: Message) => {
      if (msg.userId === userChat.userId && !msg.isAdmin && !msg.isRead) {
        return { ...msg, isRead: true };
      }
      return msg;
    });
    localStorage.setItem('misat_chat_messages', JSON.stringify(updatedMessages));

    // Обновляем список чатов
    const updatedUsers = users.map(u =>
      u.userId === userChat.userId ? { ...u, unreadCount: 0 } : u
    );
    setUsers(updatedUsers);

    setSelectedUser({ ...userChat, unreadCount: 0 });
  };

  const filteredUsers = users.filter(u =>
    u.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    if (diff < 24 * 60 * 60 * 1000) {
      return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' });
  };

  return (
    <div>
      <h1 className="text-3xl font-light mb-6">Чат с <span className="font-bold">клиентами</span></h1>

      <div className="flex h-[calc(100vh-200px)] bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-200">
        {/* Список чатов */}
        <div className="w-80 border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b">
            <input
              type="text"
              placeholder="Поиск клиента..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-black"
            />
          </div>
          <div className="flex-1 overflow-y-auto">
            {filteredUsers.length === 0 ? (
              <div className="text-center text-gray-500 py-10">
                <i className="fas fa-comments text-4xl mb-2"></i>
                <p>Нет активных чатов</p>
                <p className="text-sm mt-2">Когда клиенты напишут, они появятся здесь</p>
              </div>
            ) : (
              filteredUsers.map(userChat => (
                <button
                  key={userChat.userId}
                  onClick={() => selectUser(userChat)}
                  className={`w-full p-4 text-left border-b hover:bg-gray-50 transition ${
                    selectedUser?.userId === userChat.userId ? 'bg-gray-100' : ''
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-black">{userChat.userName}</p>
                      <p className="text-xs text-gray-500">{userChat.email}</p>
                      <p className="text-sm text-gray-500 truncate mt-1">{userChat.lastMessage}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-400">{formatTime(userChat.lastMessageTime)}</p>
                      {userChat.unreadCount > 0 && (
                        <span className="inline-block mt-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                          {userChat.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Область чата */}
        <div className="flex-1 flex flex-col">
          {selectedUser ? (
            <>
              {/* Заголовок чата */}
              <div className="p-4 border-b bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center text-white">
                    <i className="fas fa-user"></i>
                  </div>
                  <div>
                    <p className="font-black">{selectedUser.userName}</p>
                    <p className="text-xs text-gray-500">{selectedUser.email}</p>
                  </div>
                </div>
              </div>

              {/* Сообщения */}
              <div className="flex-1 overflow-y-auto p-4 bg-gray-50 flex flex-col gap-3">
                {selectedUser.messages.length === 0 ? (
                  <div className="text-center text-gray-500 py-10">
                    <i className="fas fa-comment-dots text-4xl mb-2"></i>
                    <p>Нет сообщений</p>
                    <p className="text-sm">Напишите первое сообщение клиенту</p>
                  </div>
                ) : (
                  selectedUser.messages.map(msg => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.isAdmin ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[70%] p-3 rounded-2xl ${
                          msg.isAdmin
                            ? 'bg-black text-white'
                            : 'bg-white border border-gray-200'
                        }`}
                      >
                        {!msg.isAdmin && (
                          <p className="text-xs font-bold text-gray-500 mb-1">{selectedUser.userName}</p>
                        )}
                        <p className="text-sm break-words">{msg.message}</p>
                        <p className={`text-xs mt-1 ${msg.isAdmin ? 'text-gray-400' : 'text-gray-400'}`}>
                          {formatTime(msg.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Поле ввода */}
              <div className="p-4 border-t flex gap-2 bg-white">
                <input
                  type="text"
                  placeholder="Введите сообщение..."
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
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400">
              <div className="text-center">
                <i className="fas fa-comments text-5xl mb-4"></i>
                <p>Выберите чат для начала общения</p>
                <p className="text-sm mt-2">Когда клиенты напишут, они появятся в списке слева</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminChat;