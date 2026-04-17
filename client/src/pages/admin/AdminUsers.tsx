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
      <div className="mb-8">
        <h1 className="text-3xl font-black tracking-tighter">УПРАВЛЕНИЕ ПОЛЬЗОВАТЕЛЯМИ</h1>
        <p className="text-gray-500 mt-1">Всего пользователей: {users.length}</p>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <input
            type="text"
            placeholder="Поиск по email или имени..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-xl focus:border-black focus:outline-none"
          />
          <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr className="text-left">
                <th className="px-6 py-4 text-sm font-black">ID</th>
                <th className="px-6 py-4 text-sm font-black">Пользователь</th>
                <th className="px-6 py-4 text-sm font-black">Email</th>
                <th className="px-6 py-4 text-sm font-black">Телефон</th>
                <th className="px-6 py-4 text-sm font-black">Роль</th>
                <th className="px-6 py-4 text-sm font-black">Дата регистрации</th>
                <th className="px-6 py-4 text-sm font-black">Действия</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user.id} className="border-b hover:bg-gray-50 transition">
                  <td className="px-6 py-4 text-sm">{user.id}</td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-black">{user.first_name} {user.last_name}</p>
                      {user.id === 1 && <span className="text-xs text-blue-600">Главный админ</span>}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm">{user.email}</td>
                  <td className="px-6 py-4 text-sm">{user.phone || '—'}</td>
                  <td className="px-6 py-4">
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.id, e.target.value as 'user' | 'admin')}
                      className={`px-3 py-1 rounded-full text-xs font-bold border-0 ${
                        user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      <option value="user">Пользователь</option>
                      <option value="admin">Администратор</option>
                    </select>
                   </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(user.created_at).toLocaleDateString()}
                   </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      disabled={user.id === 1}
                      className="text-red-500 hover:text-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
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