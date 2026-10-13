import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  TrashIcon,
  EyeIcon,
  CheckIcon,
  XMarkIcon,
  ExclamationTriangleIcon,
  UserIcon,
  ChatBubbleLeftRightIcon,
  QuestionMarkCircleIcon,
  FlagIcon,
  MagnifyingGlassIcon,
  ChevronDownIcon,
  PencilIcon,
  ShieldCheckIcon,
  ClockIcon,
  ChartBarIcon,
  UsersIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import NavBar from './NavBar';

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [showBulkActions, setShowBulkActions] = useState(false);

  // Mock data - replace with actual API calls
  const [stats, setStats] = useState({
    totalUsers: 3,
    totalQuestions: 3,
    totalAnswers: 1,
    pendingReports: 2,
    todayActivity: {
      newUsers: 1,
      newQuestions: 3,
      newAnswers: 1,
      newReports: 2
    }
  });

  const [reportedContent, setReportedContent] = useState([
    {
      _id: '68724969cd0e09ef8a45bfee',
      type: 'question',
      title: 'What is the recent statement of donald trump?',
      description: '<p>Donald trump is going mad against iran</p>',
      tags: ['World War'],
      askedBy: '687229721bb23c3d1c7031e7',
      author: 'mahesh1566',
      reportedBy: 'concerned_citizen',
      reason: 'Inappropriate content',
      severity: 'high',
      status: 'pending',
      createdAt: '2025-07-12T11:39:21.161Z',
      reportedAt: '2025-07-12T11:40:00.000Z'
    },
    {
      _id: '68724775cd0e09ef8a45bef9',
      type: 'answer',
      title: 'Answer to "How to implement JWT authentication in React?"',
      content: '<p>This is how closure works in JavaScript...</p>',
      question: '6872028f4a32a1f1d5e1ecab',
      author: 'mahesh1566',
      reportedBy: 'moderator_user',
      reason: 'Spam',
      severity: 'medium',
      status: 'pending',
      createdAt: '2025-07-12T11:31:01.809Z',
      reportedAt: '2025-07-12T11:32:00.000Z'
    },
    {
      _id: '6872028f4a32a1f1d5e1ecab',
      type: 'question',
      title: 'Explain the current war situation between israel and iran',
      description: '<p>As of mid-2025, the situation between Israel and Iran is characterized by escalating tensions...</p>',
      tags: ['World War'],
      askedBy: '687229721bb23c3d1c7031e7',
      author: 'mahesh1566',
      reportedBy: 'victim_user',
      reason: 'Harassment',
      severity: 'high',
      status: 'under_review',
      createdAt: '2025-07-12T10:20:00.000Z',
      reportedAt: '2025-07-12T10:25:00.000Z'
    }
  ]);

  const [users, setUsers] = useState([
    {
      _id: '687229721bb23c3d1c7031e7',
      username: 'mahesh1566',
      email: 'mahesh@example.com',
      role: 'user',
      status: 'active',
      createdAt: '2025-01-01T00:00:00Z',
      lastActive: '2025-07-12T11:39:21.161Z',
      questionsCount: 3,
      answersCount: 1,
      reputation: 245,
      warningsCount: 0
    },
    {
      _id: '687229721bb23c3d1c7031e8',
      username: 'concerned_citizen',
      email: 'concerned@example.com',
      role: 'user',
      status: 'active',
      createdAt: '2025-01-10T00:00:00Z',
      lastActive: '2025-07-12T08:00:00Z',
      questionsCount: 5,
      answersCount: 12,
      reputation: 156,
      warningsCount: 0
    },
    {
      _id: '687229721bb23c3d1c7031e9',
      username: 'moderator_user',
      email: 'moderator@example.com',
      role: 'moderator',
      status: 'active',
      createdAt: '2025-01-05T00:00:00Z',
      lastActive: '2025-07-12T12:00:00Z',
      questionsCount: 2,
      answersCount: 25,
      reputation: 890,
      warningsCount: 0
    }
  ]);

  const handleSelectItem = (id) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedItems(newSelected);
    setShowBulkActions(newSelected.size > 0);
  };

  const handleSelectAll = (items) => {
    if (selectedItems.size === items.length) {
      setSelectedItems(new Set());
      setShowBulkActions(false);
    } else {
      setSelectedItems(new Set(items.map(item => item._id)));
      setShowBulkActions(true);
    }
  };

  const handleApproveContent = (id) => {
    setReportedContent(prev => 
      prev.map(item => 
        item._id === id ? { ...item, status: 'approved' } : item
      )
    );
  };

  const handleRejectContent = (id) => {
    setReportedContent(prev => 
      prev.map(item => 
        item._id === id ? { ...item, status: 'rejected' } : item
      )
    );
  };

  const handleDeleteContent = (id) => {
    setReportedContent(prev => prev.filter(item => item._id !== id));
  };

  const handleUserAction = (userId, action) => {
    setUsers(prev => 
      prev.map(user => {
        if (user._id === userId) {
          switch (action) {
            case 'suspend':
              return { ...user, status: 'suspended' };
            case 'activate':
              return { ...user, status: 'active' };
            case 'flag':
              return { ...user, status: 'flagged' };
            case 'warn':
              return { ...user, warningsCount: user.warningsCount + 1 };
            default:
              return user;
          }
        }
        return user;
      })
    );
  };

  const handleDeleteUser = (userId) => {
    setUsers(prev => prev.filter(user => user._id !== userId));
  };

  const handleBulkAction = (action) => {
    if (activeTab === 'reports') {
      selectedItems.forEach(id => {
        if (action === 'approve') handleApproveContent(id);
        else if (action === 'reject') handleRejectContent(id);
        else if (action === 'delete') handleDeleteContent(id);
      });
    } else if (activeTab === 'users') {
      selectedItems.forEach(id => {
        if (action === 'suspend') handleUserAction(id, 'suspend');
        else if (action === 'activate') handleUserAction(id, 'activate');
        else if (action === 'delete') handleDeleteUser(id);
      });
    }
    setSelectedItems(new Set());
    setShowBulkActions(false);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'suspended': return 'text-red-600 bg-red-100';
      case 'flagged': return 'text-yellow-600 bg-yellow-100';
      case 'pending': return 'text-blue-600 bg-blue-100';
      case 'approved': return 'text-green-600 bg-green-100';
      case 'rejected': return 'text-red-600 bg-red-100';
      case 'under_review': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const filteredReports = reportedContent.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || item.status === filterType;
    return matchesSearch && matchesFilter;
  });

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || user.status === filterType;
    return matchesSearch && matchesFilter;
  });

  const DashboardTab = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <UsersIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalUsers.toLocaleString()}</p>
              <p className="text-sm text-green-600">+{stats.todayActivity.newUsers} today</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <QuestionMarkCircleIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Questions</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalQuestions.toLocaleString()}</p>
              <p className="text-sm text-green-600">+{stats.todayActivity.newQuestions} today</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <ChatBubbleLeftRightIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Answers</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalAnswers.toLocaleString()}</p>
              <p className="text-sm text-green-600">+{stats.todayActivity.newAnswers} today</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <FlagIcon className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending Reports</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pendingReports}</p>
              <p className="text-sm text-red-600">+{stats.todayActivity.newReports} today</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => setActiveTab('reports')}
            className="flex items-center p-4 text-left bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
          >
            <FlagIcon className="h-6 w-6 text-red-600 mr-3" />
            <div>
              <p className="font-medium text-gray-900">Review Reports</p>
              <p className="text-sm text-gray-600">{stats.pendingReports} pending</p>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className="flex items-center p-4 text-left bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
          >
            <UsersIcon className="h-6 w-6 text-blue-600 mr-3" />
            <div>
              <p className="font-medium text-gray-900">Manage Users</p>
              <p className="text-sm text-gray-600">User management</p>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('content')}
            className="flex items-center p-4 text-left bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
          >
            <DocumentTextIcon className="h-6 w-6 text-green-600 mr-3" />
            <div>
              <p className="font-medium text-gray-900">Content Review</p>
              <p className="text-sm text-gray-600">Moderate content</p>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className="flex items-center p-4 text-left bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
          >
            <ChartBarIcon className="h-6 w-6 text-purple-600 mr-3" />
            <div>
              <p className="font-medium text-gray-900">Analytics</p>
              <p className="text-sm text-gray-600">View insights</p>
            </div>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
            <div className="p-2 bg-red-100 rounded-full">
              <FlagIcon className="h-4 w-4 text-red-600" />
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium text-gray-900">New report: Inappropriate content</p>
              <p className="text-xs text-gray-600">2 minutes ago</p>
            </div>
          </div>

          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
            <div className="p-2 bg-blue-100 rounded-full">
              <UserIcon className="h-4 w-4 text-blue-600" />
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium text-gray-900">User john_doe registered</p>
              <p className="text-xs text-gray-600">15 minutes ago</p>
            </div>
          </div>

          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
            <div className="p-2 bg-green-100 rounded-full">
              <CheckIcon className="h-4 w-4 text-green-600" />
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium text-gray-900">Content approved by admin</p>
              <p className="text-xs text-gray-600">1 hour ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const ReportsTab = () => (
    <div className="space-y-6">
      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search reports..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="under_review">Under Review</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>

          <button
            onClick={() => handleSelectAll(filteredReports)}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            {selectedItems.size === filteredReports.length ? 'Deselect All' : 'Select All'}
          </button>
        </div>

        {/* Bulk Actions */}
        {showBulkActions && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-700 mb-3">{selectedItems.size} items selected</p>
            <div className="flex gap-2">
              <button
                onClick={