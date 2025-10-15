import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getWorkerDashboardStatsApi } from '../../services/workers';
import { getWorkerByUserId } from '../../services/workerdashboard';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [worker, setWorker] = useState(null);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [range, setRange] = useState('month');
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Mock data for demonstration (will be replaced with real API data)
  const mockStats = {
    day: { orders: 11, sales: 1245.75, tasks: 8, performance: 92 },
    week: { orders: 58, sales: 7425.3, tasks: 39, performance: 90 },
    month: { orders: 223, sales: 28450.9, tasks: 164, performance: 93 },
  };

  const mockTasks = [
    { id: 101, title: 'Complete client installation', details: 'Project Alpha - 3 hours', priority: 'high', dueTime: '2:30 PM' },
    { id: 102, title: 'Follow up on quote', details: 'Client Beta - 1 hour', priority: 'medium', dueTime: '4:00 PM' },
    { id: 103, title: 'Update inventory records', details: 'Warehouse - 2 hours', priority: 'low', dueTime: '6:00 PM' },
  ];

  const mockSalesData = [
    { day: 'Mon', sales: 1200 },
    { day: 'Tue', sales: 1900 },
    { day: 'Wed', sales: 3000 },
    { day: 'Thu', sales: 5000 },
    { day: 'Fri', sales: 2000 },
    { day: 'Sat', sales: 2400 },
    { day: 'Sun', sales: 1800 },
  ];

  const mockRecentActivity = [
    { id: 1, action: 'Completed installation', client: 'John Smith', time: '2 hours ago', type: 'success' },
    { id: 2, action: 'New booking received', client: 'Sarah Johnson', time: '4 hours ago', type: 'info' },
    { id: 3, action: 'Payment received', amount: 'LKR 2,500', time: '6 hours ago', type: 'success' },
    { id: 4, action: 'Client feedback', rating: '5 stars', time: '1 day ago', type: 'success' },
  ];

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Get user from localStorage
        const savedUser = JSON.parse(localStorage.getItem('user'));
        if (!savedUser) {
          throw new Error('User not logged in');
        }
        
        setUser(savedUser);
        
        // Fetch worker data
        const workerData = await getWorkerByUserId(savedUser.id);
        setWorker(workerData.worker);
        
        // Try to fetch dashboard stats if worker ID is available
        if (workerData.worker?.id) {
          try {
            const stats = await getWorkerDashboardStatsApi(workerData.worker.id);
            setDashboardStats(stats);
          } catch (statsError) {
            console.warn('Could not fetch dashboard stats, using mock data:', statsError);
            setDashboardStats(mockStats);
          }
        } else {
          setDashboardStats(mockStats);
        }
        
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError(err.message);
        // Fallback to mock data
        setDashboardStats(mockStats);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const formatLKR = (value) =>
    `LKR ${Number(value || 0).toLocaleString('en-LK', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  const getCurrentStats = () => {
    return dashboardStats?.[range] || mockStats[range];
  };

  const getProgressData = () => {
    const stats = getCurrentStats();
    return {
      completed: Math.floor(stats.tasks * 0.3),
      inProgress: Math.floor(stats.tasks * 0.6),
      pending: Math.floor(stats.tasks * 0.1),
    };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">⚠️</div>
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const stats = getCurrentStats();
  const progress = getProgressData();

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Welcome Header with Real-time Clock */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white shadow-xl">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name || 'Worker'}! 👋</h1>
            <p className="text-blue-100 text-lg">Here's what's happening with your work today</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">
              {currentTime.toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit',
                second: '2-digit'
              })}
            </div>
            <div className="text-blue-100">
              {currentTime.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Time Range Selector */}
      <div className="flex justify-end">
        <div className="flex space-x-2 bg-gray-100 rounded-lg p-1">
          {[
            { key: 'day', label: 'Today' },
            { key: 'week', label: 'This Week' },
            { key: 'month', label: 'This Month' }
          ].map((option) => (
            <button
              key={option.key}
              onClick={() => setRange(option.key)}
              className={`px-4 py-2 rounded-md font-medium transition-all duration-200 ${
                range === option.key 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards with Animations */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Orders This {range === 'day' ? 'Day' : range === 'week' ? 'Week' : 'Month'}</p>
              <p className="text-3xl font-bold text-gray-900 animate-count-up">{stats.orders}</p>
              <p className="text-sm text-green-600 flex items-center">
                <span className="mr-1">↗</span>
                +3 from previous period
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">📦</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Sales This {range === 'day' ? 'Day' : range === 'week' ? 'Week' : 'Month'}</p>
              <p className="text-3xl font-bold text-gray-900 animate-count-up">{formatLKR(stats.sales)}</p>
              <p className="text-sm text-red-600 flex items-center">
                <span className="mr-1">↘</span>
                -LKR 245.25 from previous
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">💰</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tasks Completed</p>
              <p className="text-3xl font-bold text-gray-900 animate-count-up">{stats.tasks}</p>
              <p className="text-sm text-green-600 flex items-center">
                <span className="mr-1">↗</span>
                +2 from previous period
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">✅</span>
            </div>
          </div>
        </div>
      </div>

      {/* Performance and Progress Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <span className="mr-2">📊</span>
            Performance Score
          </h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-4xl font-bold text-gray-900 animate-count-up">{stats.performance}%</p>
              <p className="text-sm text-green-600 flex items-center">
                <span className="mr-1">↗</span>
                +5% from last period
              </p>
            </div>
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-3xl">📈</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <span className="mr-2">⚡</span>
            Work Progress
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>Completed</span>
              <span className="font-semibold">{progress.completed}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div className="bg-blue-600 h-3 rounded-full animate-progress" style={{ width: '30%' }}></div>
            </div>
            <div className="flex justify-between text-sm">
              <span>In Progress</span>
              <span className="font-semibold">{progress.inProgress}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div className="bg-green-600 h-3 rounded-full animate-progress" style={{ width: '60%' }}></div>
            </div>
            <div className="flex justify-between text-sm">
              <span>Pending</span>
              <span className="font-semibold">{progress.pending}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div className="bg-gray-400 h-3 rounded-full animate-progress" style={{ width: '10%' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Tasks */}
        <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <span className="mr-2">📋</span>
            Upcoming Tasks
          </h3>
          <div className="space-y-3">
            {mockTasks.map((task, index) => (
              <div key={task.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200 animate-slide-in" style={{ animationDelay: `${index * 100}ms` }}>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{task.title}</p>
                  <p className="text-sm text-gray-600">{task.details}</p>
                  <p className="text-xs text-blue-600 font-medium">Due: {task.dueTime}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    task.priority === 'high' ? 'bg-red-100 text-red-800' :
                    task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {task.priority}
                  </span>
                  <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors duration-200">
                    Start
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <span className="mr-2">🔄</span>
            Recent Activity
          </h3>
          <div className="space-y-3">
            {mockRecentActivity.map((activity, index) => (
              <div key={activity.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200 animate-slide-in" style={{ animationDelay: `${index * 100}ms` }}>
                <div className={`w-2 h-2 rounded-full ${
                  activity.type === 'success' ? 'bg-green-500' :
                  activity.type === 'info' ? 'bg-blue-500' :
                  'bg-yellow-500'
                }`}></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                  <p className="text-xs text-gray-600">
                    {activity.client && `${activity.client} • `}
                    {activity.amount && `${activity.amount} • `}
                    {activity.rating && `${activity.rating} • `}
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sales Chart */}
      <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <span className="mr-2">📈</span>
          Sales Performance (Last 7 Days)
        </h3>
        <div className="space-y-4">
          {mockSalesData.map((item, index) => (
            <div key={index} className="flex items-center justify-between animate-slide-in" style={{ animationDelay: `${index * 100}ms` }}>
              <span className="text-sm font-medium text-gray-600 w-12">{item.day}</span>
              <div className="flex items-center space-x-2 flex-1 mx-4">
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full animate-progress" 
                    style={{ width: `${(item.sales / 5000) * 100}%` }}
                  ></div>
                </div>
              </div>
              <span className="text-sm font-medium text-gray-900 w-20 text-right">{formatLKR(item.sales)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;