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

  useEffect(() => {
    loadChats();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedUser?.messages]);

  const loadChats = () => {
    const allMessages: Message[] = JSON.parse(localStorage.getItem('misat_chat_messages') || '[]');
    const allUsers = JSON.parse(localStorage.getItem('misat_users') || '[]');

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

      if (!msg.isAdmin && !msg.isRead) {
        chat.unreadCount++;
      }
    });

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

    const updatedMessages = [...selectedUser.messages, newMessage];
    setSelectedUser({ ...selectedUser, messages: updatedMessages, lastMessage: inputMessage, lastMessageTime: newMessage.timestamp });

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
    const allMessages = JSON.parse(localStorage.getItem('misat_chat_messages') || '[]');
    const updatedMessages = allMessages.map((msg: Message) => {
      if (msg.userId === userChat.userId && !msg.isAdmin && !msg.isRead) {
        return { ...msg, isRead: true };
      }
      return msg;
    });
    localStorage.setItem('misat_chat_messages', JSON.stringify(updatedMessages));

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
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-black tracking-tighter text-white">ЧАТ С КЛИЕНТАМИ</h1>
        <div className="flex items-center gap-2 mt-2">
          <div className="w-8 h-0.5 bg-white/40"></div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-200px)] bg-white/5 rounded-2xl overflow-hidden border border-white/10">

        {/* Список чатов */}
        <div className="w-80 border-r border-white/10 flex flex-col">
          <div className="p-4 border-b border-white/10">
            <div className="relative">
              <input
                type="text"
                placeholder="Поиск клиента..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-white/30 focus:outline-none transition"
              />
              <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm"></i>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {filteredUsers.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto bg-white/10 rounded-2xl flex items-center justify-center mb-4">
                  <i className="fas fa-comments text-white/30 text-2xl"></i>
                </div>
                <p className="text-gray-400 text-sm">Нет активных чатов</p>
                <p className="text-gray-500 text-xs mt-2">Когда клиенты напишут, они появятся здесь</p>
              </div>
            ) : (
              filteredUsers.map(userChat => (
                <button
                  key={userChat.userId}
                  onClick={() => selectUser(userChat)}
                  className={`w-full p-4 text-left border-b border-white/10 transition-all duration-200 ${
                    selectedUser?.userId === userChat.userId
                      ? 'bg-white/10'
                      : 'hover:bg-white/5'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="text-white font-black text-sm">{userChat.userName}</p>
                      <p className="text-gray-500 text-[10px] mt-0.5">{userChat.email}</p>
                      <p className="text-gray-400 text-xs truncate mt-1 max-w-[180px]">{userChat.lastMessage}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-500 text-[10px]">{formatTime(userChat.lastMessageTime)}</p>
                      {userChat.unreadCount > 0 && (
                        <span className="inline-block mt-1 bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[20px] h-5 px-1 flex items-center justify-center animate-pulse">
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
              <div className="p-4 border-b border-white/10 bg-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-white">
                    <i className="fas fa-user text-sm"></i>
                  </div>
                  <div>
                    <p className="text-white font-black text-sm">{selectedUser.userName}</p>
                    <p className="text-gray-500 text-[10px]">{selectedUser.email}</p>
                  </div>
                </div>
              </div>

              {/* Сообщения */}
              <div className="flex-1 overflow-y-auto p-4 bg-black/30 flex flex-col gap-3 custom-scrollbar">
                {selectedUser.messages.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto bg-white/10 rounded-2xl flex items-center justify-center mb-4">
                      <i className="fas fa-comment-dots text-white/30 text-2xl"></i>
                    </div>
                    <p className="text-gray-400 text-sm">Нет сообщений</p>
                    <p className="text-gray-500 text-xs mt-2">Напишите первое сообщение клиенту</p>
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
                            ? 'bg-white text-black'
                            : 'bg-white/5 border border-white/10 text-white'
                        }`}
                      >
                        {!msg.isAdmin && (
                          <p className="text-[10px] font-bold text-gray-400 mb-1">{selectedUser.userName}</p>
                        )}
                        <p className="text-sm break-words">{msg.message}</p>
                        <p className={`text-[10px] mt-1 ${msg.isAdmin ? 'text-gray-500' : 'text-gray-500'}`}>
                          {formatTime(msg.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Поле ввода */}
              <div className="p-4 border-t border-white/10 flex gap-2 bg-white/5">
                <input
                  type="text"
                  placeholder="Введите сообщение..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1 px-4 py-2.5 bg-white/5 border border-white/10 rounded-full text-white placeholder-gray-500 text-sm focus:border-white/30 focus:outline-none transition"
                />
                <button
                  onClick={handleSendMessage}
                  className="bg-white text-black w-10 h-10 rounded-full hover:bg-gray-100 transition flex items-center justify-center"
                >
                  <i className="fas fa-paper-plane text-sm"></i>
                </button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="w-20 h-20 mx-auto bg-white/10 rounded-2xl flex items-center justify-center mb-4">
                  <i className="fas fa-comments text-white/30 text-3xl"></i>
                </div>
                <p className="text-gray-400 text-sm">Выберите чат для начала общения</p>
                <p className="text-gray-500 text-xs mt-2">Когда клиенты напишут, они появятся в списке слева</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255,255,255,0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.2);
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
};

export default AdminChat;