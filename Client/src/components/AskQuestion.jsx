import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { XMarkIcon } from '@heroicons/react/24/outline'
import SimpleRichTextEditor from './SimpleRichTextEditor'

const AskQuestion = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tags: []
  })
  const [currentTag, setCurrentTag] = useState('')
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handleTagInput = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addTag()
    }
  }

  const addTag = () => {
    const tag = currentTag.trim()
    if (tag && !formData.tags.includes(tag) && formData.tags.length < 10) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }))
      setCurrentTag('')
    }
  }

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const formatText = (command, value = null) => {
    // This function is no longer needed with React Quill
    // Keeping for backward compatibility
  }

  const insertEmoji = (emoji) => {
    // This function is no longer needed with React Quill
    // Keeping for backward compatibility
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    } else if (formData.title.length < 10) {
      newErrors.title = 'Title must be at least 10 characters long'
    } else if (formData.title.length > 150) {
      newErrors.title = 'Title must be less than 150 characters'
    }
    
    if (!formData.description.trim() || formData.description === '<p><br></p>') {
      newErrors.description = 'Description is required'
    } else if (formData.description.replace(/<[^>]*>/g, '').length < 20) {
      newErrors.description = 'Description must be at least 20 characters long'
    }
    
    if (formData.tags.length === 0) {
      newErrors.tags = 'At least one tag is required'
    } else if (formData.tags.length > 10) {
      newErrors.tags = 'Maximum 10 tags allowed'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setIsLoading(true)
    
    try {
      // Here you would typically make an API call to save the question
      console.log('Question submitted:', formData)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setIsLoading(false)
      navigate('/', { 
        state: { message: 'Question posted successfully!' }
      })
      
    } catch (error) {
      setIsLoading(false)
      setErrors({ submit: 'Failed to post question. Please try again.' })
    }
  }

  const commonEmojis = ['😀', '😊', '👍', '❤️', '🎉', '🔥', '💡', '🤔', '😕', '❓']

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
              to="/"
              className="text-gray-600 hover:text-gray-800 font-medium transition-colors"
            >
              ← Back to Questions
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Ask a Question</h1>
          <p className="text-gray-600 mb-8">
            Be specific and imagine you're asking a question to another person. 
            Include all the context someone would need to understand your problem.
          </p>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-lg font-semibold text-gray-900 mb-3">
                Title
              </label>
              <p className="text-sm text-gray-600 mb-3">
                Be specific and imagine you're asking a question to another person
              </p>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`w-full px-4 py-3 border-2 rounded-lg text-base transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.title 
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-200' 
                    : 'border-gray-300 focus:border-blue-500'
                }`}
                placeholder="e.g., How do I implement JWT authentication in React?"
                maxLength={150}
              />
              <div className="flex justify-between mt-2">
                {errors.title && <span className="text-red-500 text-sm">{errors.title}</span>}
                <span className="text-gray-500 text-sm ml-auto">
                  {formData.title.length}/150
                </span>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-lg font-semibold text-gray-900 mb-3">
                Description
              </label>
              <p className="text-sm text-gray-600 mb-3">
                Provide all the details someone would need to understand and answer your question
              </p>
              
              <SimpleRichTextEditor
                content={formData.description}
                onChange={(content) => setFormData(prev => ({ ...prev, description: content }))}
                placeholder="Describe your question in detail..."
                className={`min-h-[300px] ${errors.description ? 'border-red-500' : ''}`}
              />
              
              {errors.description && (
                <span className="text-red-500 text-sm mt-2 block">{errors.description}</span>
              )}
            </div>

            {/* Tags */}
            <div>
              <label className="block text-lg font-semibold text-gray-900 mb-3">
                Tags
              </label>
              <p className="text-sm text-gray-600 mb-3">
                Add up to 10 tags to describe what your question is about
              </p>
              
              <div className="flex flex-wrap gap-2 mb-3">
                {formData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-2 hover:text-blue-600 transition-colors"
                    >
                      <XMarkIcon className="w-4 h-4" />
                    </button>
                  </span>
                ))}
              </div>
              
              <div className="flex gap-2">
                <input
                  type="text"
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  onKeyDown={handleTagInput}
                  className={`flex-1 px-4 py-2 border-2 rounded-lg text-base transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.tags 
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-200' 
                      : 'border-gray-300 focus:border-blue-500'
                  }`}
                  placeholder="Type a tag and press Enter or comma"
                  maxLength={20}
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add
                </button>
              </div>
              
              {errors.tags && (
                <span className="text-red-500 text-sm mt-2 block">{errors.tags}</span>
              )}
              
              <div className="mt-3 text-sm text-gray-500">
                <p className="mb-1">Popular tags: React, JavaScript, Python, CSS, HTML, Node.js</p>
                <p>{formData.tags.length}/10 tags used</p>
              </div>
            </div>

            {/* Submit Error */}
            {errors.submit && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-700">{errors.submit}</p>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Posting...
                  </div>
                ) : (
                  'Post Question'
                )}
              </button>
              
              <Link
                to="/"
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-8 py-3 rounded-lg font-medium transition-colors duration-200"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}

export default AskQuestion
