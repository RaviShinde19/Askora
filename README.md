# Askora - Q&A Forum Platform

[![React](https://img.shields.io/badge/React-19.1.0-blue.svg)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-v18+-green.svg)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Latest-green.svg)](https://www.mongodb.com/)
[![Express.js](https://img.shields.io/badge/Express.js-Latest-black.svg)](https://expressjs.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4.17-blue.svg)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A modern, full-stack Q&A forum platform built with React, Node.js, Express, and MongoDB. Askora provides a seamless experience for asking questions, sharing knowledge, and building communities around various topics.

## 🚀 Features

### 🔐 Authentication & Authorization
- **User Registration & Login** with secure JWT authentication
- **Profile Management** with avatar upload support
- **Role-based Access Control** (Guest, User, Admin)
- **Session Management** with refresh tokens
- **Password Reset** functionality
- **Email Verification** system

### 📝 Content Management
- **Ask Questions** with rich text editor
- **Answer Questions** with comprehensive formatting options
- **Vote System** for questions and answers
- **Comment System** for discussions
- **Tag System** for categorization
- **Search Functionality** across questions and answers
- **Content Moderation** tools

### 🎨 Rich Text Editor
- **Enhanced Text Formatting** (Bold, Italic, Underline, Strikethrough)
- **Text Alignment** (Left, Center, Right, Justify)
- **Lists** (Ordered and Unordered)
- **Code Blocks** with syntax highlighting
- **Blockquotes** and horizontal rules
- **Link Management** with custom URLs
- **Image Upload** and embedding
- **Color Customization** for text and backgrounds
- **Undo/Redo** functionality
- **Focus-based Toolbar Animation**

### 🎯 User Experience
- **Responsive Design** optimized for all devices
- **Real-time Notifications** system
- **Advanced Search & Filtering** capabilities
- **Pagination** for better performance
- **Dark/Light Mode** support
- **Keyboard Shortcuts** for power users
- **Floating Quick Notes** editor
- **Progressive Web App** capabilities

### 📊 Analytics & Insights
- **Question Statistics** (views, votes, answers)
- **User Reputation** system
- **Activity Tracking** and analytics
- **Content Performance** metrics

## 🛠️ Tech Stack

### Frontend
- **React 19.1.0** - Modern UI library with hooks and context
- **React Router DOM 7.6.3** - Client-side routing
- **Tailwind CSS 3.4.17** - Utility-first CSS framework
- **Heroicons React 2.2.0** - Beautiful SVG icons
- **TipTap 2.26.1** - Rich text editor framework
- **Axios 1.10.0** - HTTP client for API calls
- **Vite 7.0.4** - Fast build tool and development server

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Token authentication
- **Bcrypt** - Password hashing
- **Multer** - File upload middleware
- **Cloudinary** - Image storage and management
- **Cors** - Cross-origin resource sharing

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing
- **Nodemon** - Development server auto-restart

## 📁 Project Structure

```
Askora/
├── Client/                     # Frontend React application
│   ├── public/                 # Static assets
│   ├── src/
│   │   ├── components/         # React components
│   │   │   ├── AskQuestion.jsx
│   │   │   ├── AnswerPage.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── SimpleRichTextEditor.jsx
│   │   │   └── FloatingTextEditor.jsx
│   │   ├── contexts/           # React context providers
│   │   │   └── AuthContext.jsx
│   │   ├── hooks/              # Custom React hooks
│   │   │   └── useFloatingEditor.js
│   │   ├── services/           # API service layer
│   │   │   └── api.js
│   │   ├── assets/             # Images and static files
│   │   ├── App.jsx             # Main application component
│   │   ├── main.jsx            # Application entry point
│   │   └── index.css           # Global styles
│   ├── package.json
│   ├── tailwind.config.cjs
│   ├── vite.config.js
│   └── README.md
├── server/                     # Backend Node.js application
│   ├── controllers/            # Request handlers
│   │   └── user.controller.js
│   ├── models/                 # Database models
│   │   └── user.models.js
│   ├── middleware/             # Express middleware
│   ├── routes/                 # API routes
│   ├── db/                     # Database configuration
│   │   └── db.js
│   ├── uploads/                # File upload directory
│   ├── app.js                  # Express application setup
│   ├── server.js               # Server entry point
│   ├── constants.js            # Application constants
│   └── package.json
├── docs/                       # Documentation
├── .gitignore
├── .env.example
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/RaviShinde19/Askora.git
   cd Askora
   ```

2. **Setup Backend**
   ```bash
   cd server
   npm install
   
   # Create environment file
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Setup Frontend**
   ```bash
   cd ../Client
   npm install
   ```

4. **Configure Environment Variables**
   
   Create `.env` file in the server directory:
   ```env
   PORT=8000
   CORS_ORIGIN=http://localhost:5173
   MONGODB_URI=mongodb://localhost:27017
   ACCESS_TOKEN_SECRET=your_access_token_secret
   ACCESS_TOKEN_EXPIRY=1d
   REFRESH_TOKEN_SECRET=your_refresh_token_secret
   REFRESH_TOKEN_EXPIRY=1d
   CLOUDINARY_CLOUD_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_cloudinary_key
   CLOUDINARY_API_SECRET=your_cloudinary_secret
   ```

5. **Start the Development Servers**
   
   **Backend** (Terminal 1):
   ```bash
   cd server
   npm run dev
   ```
   
   **Frontend** (Terminal 2):
   ```bash
   cd Client
   npm run dev
   ```

6. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8000

## 📖 Usage

### User Registration
1. Navigate to the registration page
2. Fill in your details (firstname, lastname, username, email, password, phone)
3. Upload a profile picture (optional)
4. Accept terms and conditions
5. Submit the form to create your account

### Asking Questions
1. Log in to your account
2. Click "Ask New Question" button
3. Provide a clear, descriptive title
4. Write detailed question content using the rich text editor
5. Add relevant tags to categorize your question
6. Submit your question

### Answering Questions
1. Browse questions on the dashboard
2. Click on a question to view details
3. Use the rich text editor to write your answer
4. Include code examples, links, or images as needed
5. Submit your answer

### Voting and Interaction
- Vote up/down on questions and answers
- Comment on posts for clarification
- Follow interesting topics and users
- Earn reputation points through contributions

## 🔧 API Documentation

### Authentication Endpoints
- `POST /api/v1/users/register` - User registration
- `POST /api/v1/users/login` - User login
- `POST /api/v1/users/logout` - User logout
- `POST /api/v1/users/refresh` - Refresh access token

### Question Endpoints
- `GET /api/v1/questions` - Get all questions
- `GET /api/v1/questions/:id` - Get specific question
- `POST /api/v1/questions` - Create new question
- `PUT /api/v1/questions/:id` - Update question
- `DELETE /api/v1/questions/:id` - Delete question

### Answer Endpoints
- `GET /api/v1/questions/:id/answers` - Get answers for a question
- `POST /api/v1/questions/:id/answers` - Create new answer
- `PUT /api/v1/answers/:id` - Update answer
- `DELETE /api/v1/answers/:id` - Delete answer

### Vote Endpoints
- `POST /api/v1/questions/:id/vote` - Vote on question
- `POST /api/v1/answers/:id/vote` - Vote on answer

## 🎨 UI Components

### Navbar Component
- Responsive navigation bar
- Authentication-based visibility
- User profile dropdown
- Notification center
- Search functionality

### Rich Text Editor
- Advanced formatting toolbar
- Real-time content preview
- Image upload and embedding
- Code syntax highlighting
- Customizable themes

### Question Card
- Question preview with metadata
- Tag display
- Vote and answer counts
- Author information
- Time stamps

## 📱 Mobile Responsiveness

The application is fully responsive and optimized for:
- **Desktop** (1200px+)
- **Tablet** (768px - 1199px)
- **Mobile** (320px - 767px)

Features mobile-specific optimizations:
- Collapsible navigation
- Touch-friendly buttons
- Optimized text input
- Swipe gestures
- Reduced data usage

## 🔒 Security Features

- **JWT Authentication** with secure token storage
- **Password Hashing** using bcrypt
- **Input Validation** and sanitization
- **CORS Protection** for cross-origin requests
- **Rate Limiting** to prevent abuse
- **File Upload Security** with type validation
- **XSS Protection** in rich text content
- **CSRF Protection** for form submissions

## 📊 Performance Optimization

- **Code Splitting** for reduced bundle size
- **Lazy Loading** of components and routes
- **Image Optimization** with Cloudinary
- **Caching Strategies** for API responses
- **Database Indexing** for faster queries
- **Pagination** for large data sets
- **Compression** for static assets

## 🧪 Testing

### Frontend Testing
```bash
cd Client
npm run test
```

### Backend Testing
```bash
cd server
npm run test
```

### End-to-End Testing
```bash
npm run test:e2e
```

## 📦 Deployment

### Frontend Deployment (Netlify/Vercel)
```bash
cd Client
npm run build
# Deploy the dist/ folder
```

### Backend Deployment (Railway/Heroku)
```bash
cd server
# Set environment variables
# Deploy to your preferred platform
```

### Database Deployment (MongoDB Atlas)
1. Create a MongoDB Atlas cluster
2. Update MONGODB_URI in your environment variables
3. Configure network access and database users

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style Guidelines
- Use ESLint and Prettier for code formatting
- Follow React best practices and hooks guidelines
- Write meaningful commit messages
- Add comments for complex logic
- Include tests for new features

## 🐛 Bug Reports

If you encounter any bugs, please create an issue with:
- Clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Screenshots (if applicable)
- Browser/device information

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **React Team** for the amazing framework
- **Tailwind CSS** for the utility-first approach
- **MongoDB** for the flexible database
- **Cloudinary** for image management
- **TipTap** for the rich text editor
- **Heroicons** for beautiful icons
- **Open Source Community** for inspiration and contributions

## 📞 Support

- **Email**: shinderavi1905@gmail.com
- **GitHub Issues**: [Report bugs](https://github.com/RaviShinde19/Askora)

## 🗺️ Roadmap

### Phase 1 (Completed)
- ✅ User authentication and registration
- ✅ Question and answer system
- ✅ Rich text editor
- ✅ Voting system
- ✅ Responsive design

### Phase 2 (In Progress)
- 🔄 Real-time notifications
- 🔄 Advanced search and filtering
- 🔄 User reputation system
- 🔄 Comment system
- 🔄 Tag management

### Phase 3 (Planned)
- 📋 Admin dashboard
- 📋 Content moderation tools
- 📋 Analytics and insights
- 📋 Mobile app
- 📋 API documentation portal

---

<div align="center">
  <p>Built with ❤️ by Ravi Shinde</p>
  <p>© 2024 Askora. All rights reserved.</p>
</div>
