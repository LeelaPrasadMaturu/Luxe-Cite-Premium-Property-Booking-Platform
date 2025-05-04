'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { FiEdit, FiTrash2, FiPlus } from 'react-icons/fi';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
    password: '',
    name: '',
    phone: '',
    role: 'GUEST'
  });
  const { token, user } = useSelector((state) => state.auth);
  const router = useRouter();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    if (!token || user?.role !== 'ADMIN') {
      router.push('/login');
      return;
    }
    fetchUsers();
  }, [token, user, router]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/admin/users`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const usersData = Array.isArray(response.data) ? response.data : [];
      setUsers(usersData);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(err.response?.data?.message || 'Error fetching users');
      setLoading(false);
      setUsers([]);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewUser(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Prepare user data
      const userData = {
        ...newUser,
        // Ensure role is uppercase
        role: newUser.role.toUpperCase()
      };

      console.log('Submitting user data:', userData); // Debug log

      const response = await axios.post(`${apiUrl}/api/auth/register`, userData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('User added successfully:', response.data);
      
      // Reset form
      setNewUser({
        username: '',
        email: '',
        password: '',
        name: '',
        phone: '',
        role: 'GUEST'
      });

      // Refresh users list
      await fetchUsers();
    } catch (err) {
      console.error('Error adding user:', err);
      setError(err.response?.data?.message || 'Error adding user');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    
    try {
      await axios.delete(`${apiUrl}/api/admin/users/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      fetchUsers();
    } catch (err) {
      console.error('Error deleting user:', err);
      setError(err.response?.data?.message || 'Error deleting user');
    }
  };

  if (loading) return <div className="text-black">Loading...</div>;
  if (error) return <div className="text-black">Error: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-black">Manage Users</h1>
      
      {/* Add User Form */}
      <form onSubmit={handleSubmit} className="mb-8 p-4 bg-gray-50 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input
              type="text"
              name="username"
              required
              value={newUser.username}
              onChange={handleInputChange}
              className="w-full border p-2 rounded text-black placeholder-gray-500"
              placeholder="Username"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              required
              value={newUser.email}
              onChange={handleInputChange}
              className="w-full border p-2 rounded text-black placeholder-gray-500"
              placeholder="Email address"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              name="password"
              required
              value={newUser.password}
              onChange={handleInputChange}
              className="w-full border p-2 rounded text-black placeholder-gray-500"
              placeholder="Password"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              name="name"
              required
              value={newUser.name}
              onChange={handleInputChange}
              className="w-full border p-2 rounded text-black placeholder-gray-500"
              placeholder="Full Name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input
              type="tel"
              name="phone"
              required
              value={newUser.phone}
              onChange={handleInputChange}
              className="w-full border p-2 rounded text-black placeholder-gray-500"
              placeholder="Phone Number"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <select
              name="role"
              value={newUser.role}
              onChange={handleInputChange}
              className="w-full border p-2 rounded text-black"
            >
              <option value="GUEST">Guest</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
        </div>

        <div className="mt-4">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            Add User
          </button>
        </div>
      </form>

      {/* Users Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 text-black font-semibold">Username</th>
              <th className="py-2 text-black font-semibold">Email</th>
              <th className="py-2 text-black font-semibold">Name</th>
              <th className="py-2 text-black font-semibold">Phone</th>
              <th className="py-2 text-black font-semibold">Role</th>
              <th className="py-2 text-black font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(users) && users.length > 0 ? (
              users.map((user) => (
                <tr key={user._id} className="border-t">
                  <td className="py-2 text-black">{user.username}</td>
                  <td className="py-2 text-black">{user.email}</td>
                  <td className="py-2 text-black">{user.name}</td>
                  <td className="py-2 text-black">{user.phone}</td>
                  <td className="py-2 text-black">
                    <span className={`px-2 py-1 rounded text-sm ${
                      user.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="py-2">
                    <button
                      onClick={() => handleDelete(user._id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="py-4 text-center text-black">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
} 