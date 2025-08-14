# SocialEase Backend

A robust Node.js backend API for SocialEase, a social skills development platform that helps users improve through interactive scenarios, self-assessments, and gamified learning experiences.

## Features

- **User Authentication & Management** - JWT-based auth with Google OAuth support
- **Scenario System** - Interactive social scenarios with adaptive difficulty
- **Gamification Engine** - XP, levels, badges, and streaks to motivate progress
- **Self-Assessment Module** - Regular progress evaluation and reflection
- **Progress Tracking** - Comprehensive user progress and analytics
- **Admin Dashboard** - User management and system monitoring
- **Real-time Feedback** - Immediate response and guidance
- **Goal Setting** - Personal development objectives and tracking

## Tech Stack

- **Runtime**: Node.js 18+ with Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT + Google OAuth
- **Validation**: Express-validator with custom middleware
- **Security**: Helmet, CORS, Rate limiting, Input sanitization
- **Documentation**: Swagger/OpenAPI 3.0
- **Logging**: Winston with structured logging
- **File Upload**: Cloudinary integration
- **Testing**: Jest (configured)
- **CI/CD**: GitHub Actions with automated testing
- **Containerization**: Docker support for development and production

## Project Structure

```
src/
├── config/          # Configuration files (DB, Swagger, Cloudinary)
├── controllers/     # Request handlers and business logic
├── middleware/      # Authentication, validation, error handling
├── models/          # Mongoose schemas and data models
├── repositories/    # Data access layer abstraction
├── routes/          # API endpoint definitions
├── services/        # Business logic and external integrations
├── utils/           # Helper functions and utilities
└── validators/      # Input validation schemas
```

## Quick Start

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

## Environment Variables

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

## API Documentation

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

### Authentication

Most endpoints require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Badge System

SocialEase features a comprehensive achievement system with badges for:
- XP milestones (every 100 XP)
- Daily streaks (5, 10, 30 days)
- Self-assessment completion
- Special achievements

See [BADGES.md](BADGES.md) for complete badge details.

## Development

### Available Scripts

```bash
npm start          # Start production server
npm run dev        # Start development server with nodemon
npm test           # Run test suite
npm run lint       # Code linting
```

### Docker Support

```bash
# Development
npm run docker:build
npm run docker:run

# Production
npm run docker:build-prod
npm run docker:run-prod
```

## Security Features

- **JWT Authentication** - Secure token-based authentication
- **Role-based Access Control** - Admin and user role separation
- **Input Validation** - Comprehensive request validation
- **Rate Limiting** - Protection against abuse
- **CORS Configuration** - Controlled cross-origin access
- **Helmet Security** - Security headers and protection
- **Input Sanitization** - XSS and injection protection

## Testing

```bash
npm test           # Run all tests
npm run test:watch # Run tests in watch mode
npm run test:coverage # Generate coverage report
```

## Deployment

### Production Build

```bash
npm run build
npm start
```

### Docker Deployment

```bash
docker build -t socialease-backend .
docker run -p 4000:4000 socialease-backend
```

### Environment Considerations

- Set `NODE_ENV=production`
- Use strong JWT secrets
- Configure MongoDB connection pooling
- Enable logging and monitoring
- Set up proper CORS origins

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For questions or issues:
- Check the API documentation at `/api/docs`
- Review existing issues in the repository
- Create a new issue with detailed information

---

**SocialEase Backend** - Empowering social skills development through technology

