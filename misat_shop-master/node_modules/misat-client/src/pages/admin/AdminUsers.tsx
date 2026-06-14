import React, { useState, useEffect } from 'react';
import { getUsers, saveUsers, User } from '../../services/storageService';
import toast from 'react-hot-toast';

const AdminUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    setUsers(getUsers());
  };

  const handleRoleChange = (userId: number, newRole: 'user' | 'admin') => {
    const updatedUsers = users.map(u =>
      u.id === userId ? { ...u, role: newRole } : u
    );
    saveUsers(updatedUsers);
    setUsers(updatedUsers);
    toast.success('Роль пользователя обновлена');
  };

  const handleDeleteUser = (userId: number) => {
    if (userId === 1) {
      toast.error('Нельзя удалить главного администратора');
      return;
    }
    if (confirm('Удалить пользователя?')) {
      const filtered = users.filter(u => u.id !== userId);
      saveUsers(filtered);
      setUsers(filtered);
      toast.success('Пользователь удалён');
    }
  };

  const filteredUsers = users.filter(u =>
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.last_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-black tracking-tighter text-white">УПРАВЛЕНИЕ ПОЛЬЗОВАТЕЛЯМИ</h1>
        <div className="flex items-center gap-2 mt-2">
          <div className="w-8 h-0.5 bg-white/40"></div>
          <p className="text-gray-400 text-sm">Всего пользователей: <span className="text-white font-bold">{users.length}</span></p>
        </div>
      </div>

      {/* Search */}
      <div className="mb-5">
        <div className="relative max-w-md">
          <input
            type="text"
            placeholder="Поиск по email или имени..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-white/30 focus:outline-none transition"
          />
          <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm"></i>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/10 border-b border-white/10">
              <tr className="text-left">
                <th className="px-5 py-3 text-white/40 text-[10px] font-bold tracking-wider">ID</th>
                <th className="px-5 py-3 text-white/40 text-[10px] font-bold tracking-wider">ПОЛЬЗОВАТЕЛЬ</th>
                <th className="px-5 py-3 text-white/40 text-[10px] font-bold tracking-wider">EMAIL</th>
                <th className="px-5 py-3 text-white/40 text-[10px] font-bold tracking-wider">ТЕЛЕФОН</th>
                <th className="px-5 py-3 text-white/40 text-[10px] font-bold tracking-wider">РОЛЬ</th>
                <th className="px-5 py-3 text-white/40 text-[10px] font-bold tracking-wider">ДАТА</th>
                <th className="px-5 py-3 text-white/40 text-[10px] font-bold tracking-wider">ДЕЙСТВИЯ</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user.id} className="border-b border-white/5 hover:bg-white/5 transition">
                  <td className="px-5 py-4 text-sm text-white/60">{user.id}</td>
                  <td className="px-5 py-4">
                    <div>
                      <p className="text-white font-medium">{user.first_name} {user.last_name}</p>
                      {user.id === 1 && <span className="text-[10px] text-blue-400">Главный админ</span>}
                    </div>
                   </td>
                  <td className="px-5 py-4 text-sm text-gray-300">{user.email}</td>
                  <td className="px-5 py-4 text-sm text-gray-400">{user.phone || '—'}</td>
                  <td className="px-5 py-4">
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.id, e.target.value as 'user' | 'admin')}
                      className={`px-3 py-1 rounded-full text-[10px] font-bold border-0 focus:outline-none cursor-pointer ${
                        user.role === 'admin'
                          ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                          : 'bg-white/10 text-gray-300'
                      }`}
                    >
                      <option value="user" className="bg-[#0a0a0a]">Пользователь</option>
                      <option value="admin" className="bg-[#0a0a0a]">Администратор</option>
                    </select>
                   </td>
                  <td className="px-5 py-4 text-sm text-gray-500">
                    {new Date(user.created_at).toLocaleDateString()}
                   </td>
                  <td className="px-5 py-4">
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      disabled={user.id === 1}
                      className="text-red-400 hover:text-red-300 transition disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                   </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;