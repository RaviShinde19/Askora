import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    profilePic: null,
    isTermsAccepted: false
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'file' ? files[0] : value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstname.trim()) {
      newErrors.firstname = 'First name is required';
    }
    
    if (!formData.lastname.trim()) {
      newErrors.lastname = 'Last name is required';
    }
    
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\+?[\d\s-()]{10,}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    
    if (!formData.isTermsAccepted) {
      newErrors.isTermsAccepted = 'You must accept the terms and conditions';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!validateForm()) return;

  setIsLoading(true);

  try {
    const formDataToSend = new FormData();
    formDataToSend.append('firstname', formData.firstname);
    formDataToSend.append('lastname', formData.lastname);
    formDataToSend.append('username', formData.username);
    formDataToSend.append('email', formData.email);
    formDataToSend.append('password', formData.password);
    formDataToSend.append('phone', formData.phone);
    formDataToSend.append('isTermsAccepted', formData.isTermsAccepted ? "true" : "false");

    if (formData.profilePic) {
      formDataToSend.append('profilePic', formData.profilePic);
    }

    const response = await fetch('http://localhost:8000/api/v1/users/register', {
      method: 'POST',
      body: formDataToSend,
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Registration failed');
    }

    // ✅ Get the profilePicUrl from backend response
    const profilePicUrl = result?.user?.profilePicUrl;

    console.log('Uploaded profile pic URL:', profilePicUrl); // ✅ You can now store this if needed

    setIsLoading(false);

    navigate('/login', {
      state: {
        message: 'Registration successful! Please sign in.',
        status: 'success',
      },
    });
  } catch (error) {
    setIsLoading(false);
    const errorMessage = error.message || 'Registration failed. Please try again.';

    if (errorMessage.includes('email')) {
      setErrors({ email: 'This email is already registered.' });
    } else if (errorMessage.includes('phone')) {
      setErrors({ phone: 'This phone number is already registered.' });
    } else if (errorMessage.includes('required')) {
      setErrors({ submit: 'All fields are required' });
    } else {
      setErrors({ submit: errorMessage });
    }
  }
};

  return (
    <div className="min-h-screen bg-gray-50 font-inter">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="text-2xl font-bold text-gray-900 tracking-tight">
              Ask<span className="text-blue-600">ora</span>
            </Link>
            <Link
              to="/login"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200 shadow-md hover:shadow-lg"
            >
              Login
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-16">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="text-center mb-8">
            <h2 className="text-gray-900 text-3xl font-bold mb-2">Create Account</h2>
            <p className="text-gray-600">Join our community and start asking questions</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstname" className="block text-sm font-semibold text-gray-700 mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  id="firstname"
                  name="firstname"
                  value={formData.firstname}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border-2 rounded-lg text-base transition-all duration-300 bg-gray-50 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 ${
                    errors.firstname ? 'border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-200' : 'border-gray-200'
                  }`}
                  placeholder="Enter your first name"
                  required
                />
                {errors.firstname && <span className="text-red-500 text-sm mt-1 block font-medium">{errors.firstname}</span>}
              </div>

              <div>
                <label htmlFor="lastname" className="block text-sm font-semibold text-gray-700 mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastname"
                  name="lastname"
                  value={formData.lastname}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border-2 rounded-lg text-base transition-all duration-300 bg-gray-50 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 ${
                    errors.lastname ? 'border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-200' : 'border-gray-200'
                  }`}
                  placeholder="Enter your last name"
                  required
                />
                {errors.lastname && <span className="text-red-500 text-sm mt-1 block font-medium">{errors.lastname}</span>}
              </div>
            </div>

            <div>
              <label htmlFor="username" className="block text-sm font-semibold text-gray-700 mb-2">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className={`w-full px-4 py-3 border-2 rounded-lg text-base transition-all duration-300 bg-gray-50 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 ${
                  errors.username ? 'border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-200' : 'border-gray-200'
                }`}
                placeholder="Choose a unique username"
                required
              />
              {errors.username && <span className="text-red-500 text-sm mt-1 block font-medium">{errors.username}</span>}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-3 border-2 rounded-lg text-base transition-all duration-300 bg-gray-50 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 ${
                  errors.email ? 'border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-200' : 'border-gray-200'
                }`}
                placeholder="Enter your email"
                required
              />
              {errors.email && <span className="text-red-500 text-sm mt-1 block font-medium">{errors.email}</span>}
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={`w-full px-4 py-3 border-2 rounded-lg text-base transition-all duration-300 bg-gray-50 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 ${
                  errors.phone ? 'border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-200' : 'border-gray-200'
                }`}
                placeholder="Enter your phone number"
                required
              />
              {errors.phone && <span className="text-red-500 text-sm mt-1 block font-medium">{errors.phone}</span>}
            </div>

            <div>
              <label htmlFor="profilePic" className="block text-sm font-semibold text-gray-700 mb-2">
                Profile Picture (Optional)
              </label>
              <input
                type="file"
                id="profilePic"
                name="profilePic"
                onChange={handleChange}
                accept="image/*"
                className="w-full px-4 py-3 border-2 rounded-lg text-base transition-all duration-300 bg-gray-50 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 border-gray-200"
              />
              <p className="text-xs text-gray-500 mt-1">Upload a profile picture (JPG, PNG, WebP)</p>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-4 py-3 border-2 rounded-lg text-base transition-all duration-300 bg-gray-50 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 ${
                  errors.password ? 'border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-200' : 'border-gray-200'
                }`}
                placeholder="Create a strong password"
                required
              />
              <div className="mt-1 text-xs text-gray-500">
                Password must contain:
                <ul className="list-disc list-inside">
                  <li className={formData.password.length >= 8 ? 'text-green-500' : ''}>At least 8 characters</li>
                  <li className={/[A-Z]/.test(formData.password) ? 'text-green-500' : ''}>One uppercase letter</li>
                  <li className={/[a-z]/.test(formData.password) ? 'text-green-500' : ''}>One lowercase letter</li>
                  <li className={/\d/.test(formData.password) ? 'text-green-500' : ''}>One number</li>
                </ul>
              </div>
              {errors.password && <span className="text-red-500 text-sm mt-1 block font-medium">{errors.password}</span>}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full px-4 py-3 border-2 rounded-lg text-base transition-all duration-300 bg-gray-50 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 ${
                  errors.confirmPassword ? 'border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-200' : 'border-gray-200'
                }`}
                placeholder="Confirm your password"
                required
              />
              {errors.confirmPassword && <span className="text-red-500 text-sm mt-1 block font-medium">{errors.confirmPassword}</span>}
            </div>

            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                id="isTermsAccepted"
                name="isTermsAccepted"
                checked={formData.isTermsAccepted}
                onChange={handleChange}
                className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                required
              />
              <label htmlFor="isTermsAccepted" className="text-sm text-gray-700">
                I agree to the{' '}
                <a href="#" className="text-blue-600 hover:text-blue-800 hover:underline">
                  Terms and Conditions
                </a>{' '}
                and{' '}
                <a href="#" className="text-blue-600 hover:text-blue-800 hover:underline">
                  Privacy Policy
                </a>
              </label>
            </div>
            {errors.isTermsAccepted && <span className="text-red-500 text-sm font-medium">{errors.isTermsAccepted}</span>}

            {errors.submit && (
              <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">
                {errors.submit}
              </div>
            )}

            <button 
              type="submit" 
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg text-base font-semibold transition-all duration-300 hover:bg-blue-700 hover:shadow-lg hover:-translate-y-1 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none relative"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="opacity-0">Creating Account...</span>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  </div>
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <div className="text-center mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-600 hover:text-blue-800 font-medium hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Register;
