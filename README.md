# 🚀 SocialEase Backend

A robust Node.js backend API for SocialEase, a social skills development platform that helps users improve through interactive scenarios, self-assessments, and gamified learning experiences.

## ✨ Features

- **🔐 User Authentication & Management** - JWT-based auth with Google OAuth support
- **🎭 Scenario System** - Interactive social scenarios with adaptive difficulty
- **🏆 Gamification Engine** - XP, levels, badges, and streaks to motivate progress
- **📊 Self-Assessment Module** - Regular progress evaluation and reflection
- **📈 Progress Tracking** - Comprehensive user progress and analytics
- **👑 Admin Dashboard** - User management and system monitoring
- **💬 Real-time Feedback** - Immediate response and guidance
- **🎯 Goal Setting** - Personal development objectives and tracking

## 🛠️ Tech Stack

- **Runtime**: Node.js 18+ with Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT + Google OAuth
- **Validation**: Express-validator with custom middleware
- **Security**: Helmet, CORS, Rate limiting, Input sanitization
- **Documentation**: Swagger/OpenAPI 3.0
- **Logging**: Winston with structured logging
- **File Upload**: Cloudinary integration
- **Testing**: Jest with comprehensive test coverage
- **CI/CD**: GitHub Actions with automated testing and deployment
- **Containerization**: Docker support for development and production
- **Code Quality**: ESLint, Husky pre-commit hooks

## 🏗️ Project Structure

```
src/
├── config/          # Configuration files (DB, Swagger, Cloudinary)
├── controllers/     # Request handlers and HTTP layer
├── middleware/      # Authentication, validation, error handling
├── models/          # Mongoose schemas and data models
├── repositories/    # Data access layer abstraction
├── routes/          # API endpoint definitions
├── services/        # Business logic and external integrations
├── utils/           # Helper functions and utilities
└── validators/      # Input validation schemas
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- MongoDB instance
- Cloudinary account (for file uploads)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd socialease-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment setup**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

The API will be available at `http://localhost:4000`

## 🔧 Environment Variables

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=4000
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017/socialease

# Authentication
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000
```

## 📚 API Documentation

Interactive API documentation is available at `/api/docs` when the server is running.

### Core Endpoints

| Resource | Method | Endpoint | Description |
|----------|--------|----------|-------------|
| **Auth** | POST | `/api/auth/login` | User authentication |
| | POST | `/api/auth/register` | User registration |
| | POST | `/api/auth/google` | Google OAuth |
| **Users** | GET | `/api/user/profile` | Get user profile |
| | PUT | `/api/user/profile` | Update profile |
| | GET | `/api/user/dashboard` | User dashboard data |
| **Scenarios** | GET | `/api/scenarios` | List available scenarios |
| | GET | `/api/scenarios/:id` | Get specific scenario |
| | POST | `/api/scenarios/:id/complete` | Mark scenario complete |
| **Progress** | GET | `/api/progress/:userId` | User progress data |
| | POST | `/api/progress/update` | Update progress |
| **Feedback** | POST | `/api/feedback` | Submit scenario feedback |
| **Self-Assessments** | POST | `/api/self-assessment` | Submit assessment |
| | GET | `/api/self-assessment/:userId` | Get user assessments |
| **Admin** | GET | `/api/admin/users` | Get all users (admin only) |
| | GET | `/api/admin/analytics` | System analytics (admin only) |
| | GET | `/api/admin/feedback` | All user feedback (admin only) |

### Authentication

Most endpoints require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## 🏆 Badge System

SocialEase features a comprehensive achievement system that rewards users for progress, consistency, and achievements:

### 🎖️ XP Milestone Badges
- **First Steps** - Reach 100 XP
- **Momentum Builder** - Reach 200 XP
- **Consistent Learner** - Reach 300 XP
- **Dedicated Practitioner** - Reach 400 XP
- **Halfway Hero** - Reach 500 XP
- **Strong Commitment** - Reach 600 XP
- **Excellence Seeker** - Reach 700 XP
- **Mastery Approach** - Reach 800 XP
- **Almost Legendary** - Reach 900 XP
- **XP Master** - Reach 1000 XP

### 🌟 Special XP Badges
- **XP Legend** - Reach 5,000 total XP
- **XP God** - Reach 10,000 total XP

### 🔥 Streak Badges
- **Streak Master** - Maintain 5-day streak
- **Streak Champion** - Maintain 10-day streak
- **Streak Legend** - Maintain 30-day streak

### 📝 Self-Assessment Badges
- **Self Reflection Master** - Complete your first self-assessment

Badges are automatically awarded and displayed in user profiles, dashboards, and progress tracking.

## 🚀 CI/CD Pipeline

### Automated Workflow
- **✅ Testing** - Jest tests with MongoDB Memory Server
- **✅ Linting** - ESLint code quality checks
- **✅ Security** - npm audit and Snyk vulnerability scanning
- **✅ Building** - Production build verification
- **✅ Deployment** - Automatic deployment to Railway/Heroku

### Pipeline Triggers
- **On Push to Main** - Full CI/CD pipeline execution
- **On Pull Request** - Testing and quality checks
- **Scheduled** - Daily security scans

### Deployment Options
- **Railway** (Recommended) - Easy deployment with automatic scaling
- **Heroku** - Alternative deployment platform
- **Docker** - Containerized deployment

## 🧪 Testing

```bash
npm test                    # Run all tests
npm run test:watch         # Run tests in watch mode
npm run test:coverage      # Generate coverage report
npm run test:debug         # Run tests with debugging
```

### Test Coverage
- **Unit Tests** - Individual function testing
- **Integration Tests** - API endpoint testing
- **Database Tests** - MongoDB operations testing
- **Authentication Tests** - JWT and OAuth testing

## 🐳 Docker Support

### Development
```bash
# Build and run development environment
docker-compose up

# Build development image
npm run docker:build
npm run docker:run
```

### Production
```bash
# Build production image
npm run docker:build-prod
npm run docker:run-prod

# Run production container
docker run -p 4000:4000 socialease-backend
```

## 🔒 Security Features

- **JWT Authentication** - Secure token-based authentication
- **Role-based Access Control** - Admin and user role separation
- **Input Validation** - Comprehensive request validation
- **Rate Limiting** - Protection against abuse
- **CORS Configuration** - Controlled cross-origin access
- **Helmet Security** - Security headers and protection
- **Input Sanitization** - XSS and injection protection
- **Security Scanning** - Automated vulnerability detection

## 🛠️ Development

### Available Scripts

```bash
npm start              # Start production server
npm run dev            # Start development server with nodemon
npm test               # Run test suite
npm run test:watch     # Run tests in watch mode
npm run test:coverage  # Generate coverage report
npm run lint           # Code linting
npm run lint:fix       # Auto-fix linting issues
npm run build          # Build for production
npm run prepare        # Setup Git hooks
```

### Code Quality
- **ESLint** - Code style and quality enforcement
- **Prettier** - Code formatting
- **Husky** - Git hooks for quality checks
- **Pre-commit** - Automatic linting before commits

## 🚀 Deployment

### Production Build

```bash
npm run build
npm start
```

### Environment Considerations

- Set `NODE_ENV=production`
- Use strong JWT secrets
- Configure MongoDB connection pooling
- Enable logging and monitoring
- Set up proper CORS origins
- Configure rate limiting for production

### Health Checks

The application includes a health check endpoint at `/health` for monitoring and load balancer health checks.

## 📊 Monitoring & Logging

- **Winston Logging** - Structured logging with multiple transports
- **Morgan HTTP Logging** - Request/response logging
- **Health Endpoints** - System health monitoring
- **Error Tracking** - Comprehensive error handling and logging

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass (`npm test`)
6. Run linting (`npm run lint`)
7. Submit a pull request

### Development Guidelines
- Follow the existing code style
- Add tests for new features
- Update documentation as needed
- Ensure CI/CD pipeline passes

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details

## 🆘 Support

For questions or issues:
- Check the API documentation at `/api/docs`
- Review existing issues in the repository
- Create a new issue with detailed information
- Check the [CI/CD Guide](CI-CD_README.md) for deployment help

## 🎯 Roadmap

- [ ] Enhanced analytics dashboard
- [ ] Real-time notifications
- [ ] Advanced badge system
- [ ] Performance optimizations
- [ ] Additional authentication methods

---

**SocialEase Backend** - Empowering social skills development through technology 🚀

*Built with ❤️ using Node.js, Express, MongoDB, and modern development practices*

