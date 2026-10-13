import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ChevronUpIcon, BellIcon, HomeIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import SimpleRichTextEditor from './SimpleRichTextEditor';

const AnswerPage = () => {
  const { questionId } = useParams();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [answerContent, setAnswerContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [error, setError] = useState(null);

  // Check authentication status
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  // Fetch data with proper error handling
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch question
      const questionRes = await fetch(`http://localhost:8000/api/v1/questions/${questionId}`);
      if (!questionRes.ok) {
        if (questionRes.status === 404) {
          throw new Error('Question not found');
        }
        throw new Error('Failed to fetch question');
      }
      const questionData = await questionRes.json();
      
      // Fetch answers
      const answersRes = await fetch(`http://localhost:8000/api/v1/answers/${questionId}`);
      if (!answersRes.ok) throw new Error('Failed to fetch answers');
      const answersData = await answersRes.json();
      
      setQuestion(questionData.data || questionData);
      setAnswers(answersData.data || answersData);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [questionId]);

  // Handle voting with proper authorization
  const handleVote = async (answerId) => {
    if (!isLoggedIn) {
      setShowLoginPopup(true);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8000/api/v1/answers/${answerId}/vote`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('token');
          setIsLoggedIn(false);
          setShowLoginPopup(true);
        }
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to vote');
      }

      const updatedAnswer = await response.json();
      setAnswers(prev => 
        prev.map(answer => 
          answer._id === answerId ? updatedAnswer.data || updatedAnswer : answer
        )
      );
    } catch (err) {
      console.error('Voting error:', err);
      setError(err.message);
    }
  };

  // Handle answer submission
  const handleSubmitAnswer = async (e) => {
    e.preventDefault();
    setError(null);
    
    if (!answerContent.trim()) {
      setError('Answer content cannot be empty');
      return;
    }

    if (!isLoggedIn) {
      setShowLoginPopup(true);
      return;
    }

    setIsSubmitting(true);
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8000/api/v1/answers/createAnswer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          content: answerContent,
          questionId: questionId
        })
      });

      const responseData = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('token');
          setIsLoggedIn(false);
          setShowLoginPopup(true);
        }
        throw new Error(responseData.message || 'Failed to submit answer');
      }

      // Add the new answer to the list
      const newAnswer = responseData.data || responseData;
      setAnswers(prev => [...prev, newAnswer]);
      setAnswerContent('');
      setError(null);
    } catch (err) {
      console.error('Submission error:', err);
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
      </div>
    );
  }

  // Error state (question not found)
  if (error || !question) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">{error || 'Question not found'}</p>
          <button 
            onClick={() => navigate('/')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Back to Questions
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-6">
              <Link to="/" className="text-2xl font-bold text-gray-900 tracking-tight">
                Ask<span className="text-blue-600">ora</span>
              </Link>
              <Link to="/" className="flex items-center text-gray-600 hover:text-gray-900">
                <HomeIcon className="h-5 w-5 mr-1" />
                Home
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              {isLoggedIn ? (
                <div className="flex items-center space-x-2">
                  <img 
                    src="/api/placeholder/32/32" 
                    alt="Profile" 
                    className="h-8 w-8 rounded-full"
                  />
                  <span className="text-sm font-medium text-gray-700">User</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link to="/login" className="text-gray-600 hover:text-gray-900">
                    Login
                  </Link>
                  <Link 
                    to="/register" 
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Question Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">{question.title}</h1>
          
          {question.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {question.tags.map((tag, index) => (
                <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  {tag}
                </span>
              ))}
            </div>
          )}
          
          <div className="prose max-w-none mb-4" dangerouslySetInnerHTML={{ __html: question.description }} />
          
          <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-100">
            <span>Asked by {question.askedBy?.username || 'Unknown'}</span>
            <span>{new Date(question.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Answers Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            {answers.length} Answer{answers.length !== 1 ? 's' : ''}
          </h2>
          
          <div className="space-y-6">
            {answers.map((answer) => (
              <div key={answer._id} className="border border-gray-200 rounded-lg p-6">
                <div className="flex">
                  <div className="flex flex-col items-center mr-6">
                    <button
                      onClick={() => handleVote(answer._id)}
                      className="p-2 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                    >
                      <ChevronUpIcon className="h-6 w-6" />
                    </button>
                    <span className="text-lg font-semibold text-gray-700">
                      {answer.upvotes || 0}
                    </span>
                  </div>
                  
                  <div className="flex-1">
                    <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: answer.content }} />
                    
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                      <span className="text-sm text-gray-500">
                        Answered on {new Date(answer.createdAt).toLocaleDateString()}
                      </span>
                      <span className="bg-violet-100 text-violet-800 px-3 py-1 rounded-full text-sm">
                        {answer.author?.username || 'Unknown'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Answer Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Submit Your Answer</h2>
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmitAnswer}>
            <SimpleRichTextEditor
              value={answerContent}
              onChange={setAnswerContent}
              placeholder="Write your answer here..."
              className="min-h-[300px] mb-6"
            />
            <button
              type="submit"
              disabled={isSubmitting || !answerContent.trim()}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Answer'}
            </button>
          </form>
        </div>
      </main>

      {/* Login Popup */}
      {showLoginPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Login Required</h3>
            <p className="text-gray-600 mb-4">You need to be logged in to perform this action.</p>
            <div className="flex space-x-3">
              <Link 
                to="/login" 
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg text-center hover:bg-blue-700"
                onClick={() => setShowLoginPopup(false)}
              >
                Login
              </Link>
              <button 
                onClick={() => setShowLoginPopup(false)}
                className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnswerPage;