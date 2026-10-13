import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  MagnifyingGlassIcon, 
  PlusIcon, 
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline';

const Dashboard = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [filterBy, setFilterBy] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [showMoreDropdown, setShowMoreDropdown] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const questionsPerPage = 10;

  useEffect(() => {
  const token = localStorage.getItem("accessToken"); // or sessionStorage.getItem()
  if (token) {
    setIsLoggedIn(true);
  }
}, []);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:8000/api/v1/questions/getQuestions');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        
        // Handle the specific response format you provided
        if (result.success && Array.isArray(result.data)) {
          setQuestions(result.data);
        } else {
          throw new Error('API response format not recognized');
        }
        
      } catch (err) {
        console.error('Error fetching questions:', err);
        setError(err.message);
        setQuestions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showMoreDropdown && !event.target.closest('.dropdown-container')) {
        setShowMoreDropdown(false);
      }
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showMoreDropdown]);

  // Filter questions based on search term and filter type
  const filteredQuestions = questions.filter(question => {
    const matchesSearch = 
      question.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      question.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      question.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesFilter = 
      filterBy === 'all' || 
      (filterBy === 'answered' && question.answers?.length > 0) ||
      (filterBy === 'unanswered' && (!question.answers || question.answers.length === 0));
    
    return matchesSearch && matchesFilter;
  });

  // Sort questions based on selected option
  const sortedQuestions = [...filteredQuestions].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.createdAt) - new Date(a.createdAt);
      case 'oldest':
        return new Date(a.createdAt) - new Date(b.createdAt);
      case 'votes':
        return (b.upvotes || 0) - (a.upvotes || 0);
      case 'views':
        return (b.views || 0) - (a.views || 0);
      default:
        return 0;
    }
  });

  // Pagination calculations
  const totalPages = Math.ceil(sortedQuestions.length / questionsPerPage);
  const paginatedQuestions = sortedQuestions.slice(
    (currentPage - 1) * questionsPerPage,
    currentPage * questionsPerPage
  );

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date';
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return 'Yesterday';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading questions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center text-red-500">
          <p>Error loading questions: {error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-inter">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="text-2xl font-bold text-gray-900 tracking-tight">
              Ask<span className="text-blue-600">ora</span>
            </Link>

            {/* Login Button */}
            {!isLoggedIn && (
              <Link
                to="/login"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200 shadow-md hover:shadow-lg"
                >
                Login
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Mobile Ask Question Button */}
        <div className="mb-6 md:hidden">
          <Link
            to="/ask"
            className="w-full flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 shadow-md hover:shadow-lg"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Ask New Question
          </Link>
        </div>

        {/* Search Bar - Mobile */}
        <div className="mb-6 md:hidden">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search questions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Desktop Ask Question Button */}
        <div className="hidden md:flex mb-8 gap-4">
          <Link
            to="/ask"
            className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 shadow-lg hover:shadow-xl"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Ask New Question
          </Link>
        </div>

        {/* Mobile Filter Toggle */}
        <div className="md:hidden mb-6">
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="w-full flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-3 rounded-lg font-medium transition-colors duration-200"
          >
            <AdjustmentsHorizontalIcon className="w-5 h-5 mr-2" />
            Filters & Sort
            <ChevronDownIcon className={`w-4 h-4 ml-1 transition-transform ${showMobileFilters ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Filters and Search */}
        <div className={`mb-8 bg-white rounded-xl p-6 shadow-sm border border-gray-200 ${showMobileFilters ? 'block' : 'hidden md:block'}`}>
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-3 w-full lg:w-auto">
              <button
                onClick={() => setFilterBy('all')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                  filterBy === 'all'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterBy('answered')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                  filterBy === 'answered'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Answered
              </button>
              <button
                onClick={() => setFilterBy('unanswered')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                  filterBy === 'unanswered'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Unanswered
              </button>
              
              {/* Sort Dropdown */}
              <div className="relative dropdown-container">
                <button
                  onClick={() => setShowMoreDropdown(!showMoreDropdown)}
                  className="flex items-center bg-gray-100 text-gray-700 hover:bg-gray-200 px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                >
                  Sort: {sortBy === 'newest' ? 'Newest' : sortBy === 'oldest' ? 'Oldest' : sortBy === 'votes' ? 'Most Votes' : 'Most Views'}
                  <ChevronDownIcon className="w-4 h-4 ml-1" />
                </button>
                
                {showMoreDropdown && (
                  <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-xl z-10 border border-gray-200">
                    <div className="py-2">
                      <button
                        onClick={() => {
                          setSortBy('newest');
                          setShowMoreDropdown(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        Newest First
                      </button>
                      <button
                        onClick={() => {
                          setSortBy('oldest');
                          setShowMoreDropdown(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        Oldest First
                      </button>
                      <button
                        onClick={() => {
                          setSortBy('votes');
                          setShowMoreDropdown(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        Most Votes
                      </button>
                      <button
                        onClick={() => {
                          setSortBy('views');
                          setShowMoreDropdown(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        Most Views
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Search Bar - Desktop Only */}
            <div className="hidden md:block w-full lg:w-96">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search questions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Questions List */}
        <div className="space-y-4">
          {paginatedQuestions.length > 0 ? (
            paginatedQuestions.map((question) => (
              <div key={question._id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
                <div className="flex flex-col md:flex-row md:items-start gap-4">
                  {/* Question Content */}
                  <div className="flex-1">
                    <Link 
                      to={`/question/${question._id}`}
                      className="block group"
                    >
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                        {question.title}
                      </h3>
                    </Link>
                    <div 
                      className="text-gray-600 mb-4 line-clamp-3 prose prose-sm" 
                      dangerouslySetInnerHTML={{ __html: question.description }} 
                    />
                    
                    {/* Tags */}
                    {question.tags && question.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {question.tags.map((tag, index) => (
                          <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    
                    {/* Meta Information */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-medium">
                            {question.askedBy?.username?.charAt(0) || 'U'}
                          </div>
                          {question.askedBy?.username || 'Unknown'}
                        </span>
                        <span>{formatDate(question.createdAt)}</span>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className={(question.answers?.length > 0 ? 'text-green-600' : 'text-gray-500')}>
                          {question.answers?.length || 0} answer{question.answers?.length !== 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 text-center">
              <p className="text-gray-600">No questions found. Be the first to ask one!</p>
              <Link 
                to="/ask" 
                className="mt-4 inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
              >
                <PlusIcon className="w-5 h-5 mr-2" />
                Ask a Question
              </Link>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex justify-center items-center gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeftIcon className="w-5 h-5" />
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  currentPage === page
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {page}
              </button>
            ))}
            
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRightIcon className="w-5 h-5" />
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;