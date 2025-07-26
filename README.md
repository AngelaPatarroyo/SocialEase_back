SocialEase Backend
A Node.js + Express backend for SocialEase, an application designed to help users improve social skills through gamified scenarios, self-assessments, and progress tracking.
Includes authentication, gamification (XP, levels, badges, streaks), and Swagger API documentation.

✅ Features
User Management

Register & Login with JWT Authentication

View & Update Profile

Gamification

XP, Level, Badges, and Streak tracking

Centralized XP configuration (xpRewards.js)

Scenario Management

Create, Update, Delete Scenarios (Admin)

Mark Scenarios as Completed → Awards XP + Updates Progress

Feedback

Submit feedback for scenarios

View user feedback (Admin)

Progress Tracking

Tracks completed scenarios and achievements

Self-Assessment

Submit assessments and award XP

View assessment history

API Documentation

Available at /api/docs (Swagger UI)

✅ Tech Stack
Node.js, Express

MongoDB with Mongoose

JWT Authentication

Swagger for API Docs

Express-Validator for input validation

Helmet, CORS, Rate Limiting for security

✅ Project Structure
bash
Copy
Edit
socialease-backend/
│
├── src/
│   ├── controllers/       # Handles API requests
│   ├── services/          # Business logic
│   ├── repositories/      # Database operations
│   ├── models/            # Mongoose schemas
│   ├── routes/            # Express routes (Swagger docs included)
│   ├── middleware/        # Auth, Validation, Error Handling
│   ├── config/            # Swagger & XP config
│   ├── utils/             # Logger and helpers
│
├── .env.example           # Example environment file
├── .gitignore             # Ignores node_modules, .env, logs
├── server.js              # App entry point
└── README.md              # Documentation
✅ Setup Instructions
1. Clone the Repository
bash
Copy
Edit
git clone <your-github-repo-url>
cd socialease-backend
2. Install Dependencies
bash
Copy
Edit
npm install
3. Configure Environment Variables
Create a .env file in the root directory with:

ini
Copy
Edit
PORT=4000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
CLIENT_URL=http://localhost:3000
Or use the provided .env.example:

bash
Copy
Edit
cp .env.example .env
4. Start the Server
bash
Copy
Edit
npm start
The server will run at:

arduino
Copy
Edit
http://localhost:4000

✅ API Documentation
Swagger UI is available at:

bash
Copy
Edit
http://localhost:4000/api/docs
✅ Main API Endpoints
Resource	Method	Endpoint	Description
Auth	POST	/api/auth/register	Register user
POST	/api/auth/login	Login user
Profile	GET	/api/user/profile	Get user profile
PUT	/api/user/profile	Update user profile
Scenarios	GET	/api/scenarios	Get all scenarios
POST	/api/scenarios	Create scenario (Admin)
POST	/api/scenarios/:scenarioId/complete	Complete scenario & award XP
Feedback	POST	/api/feedback	Submit feedback
GET	/api/feedback/:userId	Get user feedback
Progress	GET	/api/progress/:userId	Get user progress
Self-Assess	POST	/api/self-assessment	Submit self-assessment
GET	/api/self-assessment/:userId	Get user assessments

✅ Security Features
JWT Authentication for all protected routes

Role-based restrictions (Admin routes)

Helmet, CORS, and Rate-limiting enabled

✅ Contributing
Fork the repo

Create a new branch for features

Submit a pull request

✅ License
MIT License

