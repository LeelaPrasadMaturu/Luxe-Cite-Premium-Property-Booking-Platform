'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { 
  FiUsers, 
  FiHome, 
  FiCalendar, 
  FiDollarSign,
  FiTrendingUp,
  FiAlertCircle,
  FiCheckCircle,
  FiClock,
  FiSettings,
  FiBarChart2
} from 'react-icons/fi';
import axios from 'axios';

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProperties: 0,
    totalBookings: 0,
    totalRevenue: 0,
    recentBookings: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (session?.user?.role !== 'ADMIN') {
      router.push('/');
    }
  }, [session, status, router]);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setLoading(true);
        setError(null);

        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        // Fetch all required data in parallel
        const [usersResponse, propertiesResponse, bookingsResponse] = await Promise.all([
          axios.get(`${apiUrl}/api/admin/users`, {
            headers: {
              'Authorization': `Bearer ${session?.accessToken}`,
              'Content-Type': 'application/json',
            },
          }),
          axios.get(`${apiUrl}/api/admin/properties`, {
            headers: {
              'Authorization': `Bearer ${session?.accessToken}`,
              'Content-Type': 'application/json',
            },
          }),
          axios.get(`${apiUrl}/api/admin/bookings`, {
            headers: {
              'Authorization': `Bearer ${session?.accessToken}`,
              'Content-Type': 'application/json',
            },
          })
        ]);

        // Calculate statistics
        const users = usersResponse.data;
        const properties = propertiesResponse.data;
        const bookings = bookingsResponse.data;

        // Calculate total revenue from confirmed bookings
        const totalRevenue = bookings
          .filter(booking => booking.status === 'confirmed')
          .reduce((sum, booking) => sum + (booking.totalPrice || 0), 0);

        // Sort all bookings by date
        const allBookings = bookings
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        setStats({
          totalUsers: users.length,
          totalProperties: properties.length,
          totalBookings: bookings.filter(b => b.status === 'confirmed').length,
          totalRevenue,
          recentBookings: allBookings // Now contains all bookings, sorted by date
        });

      } catch (err) {
        console.error('Dashboard fetch error:', err);
        setError(err.response?.data?.message || 'Error fetching dashboard data');
      } finally {
        setLoading(false);
      }
    };

    if (session?.user?.role === 'ADMIN') {
      fetchDashboardStats();
    }
  }, [session]);

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex  items-center justify-center bg-gray-50">
        <div className="bg-red-50 p-4 rounded-lg max-w-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <FiAlertCircle className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error Loading Dashboard</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
              <div className="mt-4">
                <button
                  onClick={() => window.location.reload()}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen mt-16 bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="mt-1 text-sm text-gray-600">
            Welcome back, {session?.user?.name}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {/* Total Users */}
          <div 
            onClick={() => router.push('/admin/users')}
            className="bg-white overflow-hidden shadow rounded-lg cursor-pointer hover:shadow-lg transition-shadow duration-300"
          >
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                  <FiUsers className="h-6 w-6 text-white" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Users</dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">{stats.totalUsers}</div>
                      <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                        <FiTrendingUp className="h-4 w-4" />
                        <span className="ml-1">12%</span>
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          {/* Total Properties */}
          <div 
            onClick={() => router.push('/admin/properties')}
            className="bg-white overflow-hidden shadow rounded-lg cursor-pointer hover:shadow-lg transition-shadow duration-300"
          >
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                  <FiHome className="h-6 w-6 text-white" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Properties</dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">{stats.totalProperties}</div>
                      <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                        <FiTrendingUp className="h-4 w-4" />
                        <span className="ml-1">8%</span>
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          {/* Active Bookings */}
          <div 
            onClick={() => router.push('/admin/bookings')}
            className="bg-white overflow-hidden shadow rounded-lg cursor-pointer hover:shadow-lg transition-shadow duration-300"
          >
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-yellow-500 rounded-md p-3">
                  <FiCalendar className="h-6 w-6 text-white" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Active Bookings</dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">{stats.totalBookings}</div>
                      <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                        <FiTrendingUp className="h-4 w-4" />
                        <span className="ml-1">15%</span>
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          {/* Total Revenue */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-purple-500 rounded-md p-3">
                  <FiDollarSign className="h-6 w-6 text-white" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Revenue</dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">
                        ${stats.totalRevenue.toLocaleString()}
                      </div>
                      <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                        <FiTrendingUp className="h-4 w-4" />
                        <span className="ml-1">20%</span>
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {/* Users Management */}
          <div 
            onClick={() => router.push('/admin/users')}
            className="bg-white overflow-hidden shadow rounded-lg cursor-pointer hover:shadow-lg transition-shadow duration-300"
          >
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                  <FiUsers className="h-6 w-6 text-white" />
                </div>
                <div className="ml-5">
                  <h3 className="text-lg font-medium text-gray-900">Users Management</h3>
                  <p className="mt-1 text-sm text-gray-500">View and manage all users</p>
                </div>
              </div>
            </div>
          </div>

          {/* Properties Management */}
          <div 
            onClick={() => router.push('/admin/properties')}
            className="bg-white overflow-hidden shadow rounded-lg cursor-pointer hover:shadow-lg transition-shadow duration-300"
          >
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                  <FiHome className="h-6 w-6 text-white" />
                </div>
                <div className="ml-5">
                  <h3 className="text-lg font-medium text-gray-900">Properties Management</h3>
                  <p className="mt-1 text-sm text-gray-500">Manage all properties</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bookings Management */}
          <div 
            onClick={() => router.push('/admin/bookings')}
            className="bg-white overflow-hidden shadow rounded-lg cursor-pointer hover:shadow-lg transition-shadow duration-300"
          >
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-yellow-500 rounded-md p-3">
                  <FiCalendar className="h-6 w-6 text-white" />
                </div>
                <div className="ml-5">
                  <h3 className="text-lg font-medium text-gray-900">Bookings Management</h3>
                  <p className="mt-1 text-sm text-gray-500">View and manage all bookings</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8">
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-lg leading-6 font-medium text-gray-900">All Bookings</h3>
              <p className="mt-1 text-sm text-gray-500">Complete list of booking activities in your properties.</p>
            </div>
            <div className="divide-y divide-gray-200">
              {stats.recentBookings.map((booking) => (
                <div key={booking._id} className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white">
                          {booking.user.name.charAt(0)}
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{booking.user.name}</div>
                        <div className="text-sm text-gray-500">
                          Booked {booking.property.title}
                        </div>
                        <div className="text-sm text-gray-500">
                          Check-in: {new Date(booking.checkIn).toLocaleDateString()} - 
                          Check-out: {new Date(booking.checkOut).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center text-sm text-gray-500">
                        <FiClock className="h-4 w-4 mr-1" />
                        {new Date(booking.createdAt).toLocaleDateString()}
                      </div>
                      <div className={`text-sm font-medium ${
                        booking.status === 'cancelled' 
                          ? 'text-red-600'
                          : 'text-green-600'
                      }`}>
                        ${booking.totalPrice}
                      </div>
                      <div className={`px-2 py-1 text-xs font-medium rounded-full ${
                        booking.status === 'confirmed' 
                          ? 'bg-green-100 text-green-800'
                          : booking.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {booking.status}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 