# **SocialEase Backend**

A Node.js + Express backend for **SocialEase**, an application designed to help users improve social skills through **gamified scenarios**, **self-assessments**, and **progress tracking**.

---

## ✅ **Tech Stack**
- **Node.js**, **Express**
- **MongoDB** with **Mongoose**
- **JWT Authentication**
- **Swagger** for API Docs
- **Express-Validator** for input validation
- **Helmet**, **CORS**, **Rate Limiting** for security

---

## ✅ **Project Structure**

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

git clone <your-github-repo-url>
cd socialease-backend

2. Install Dependencies

npm install

3. Configure Environment Variables
Create a .env file in the root directory:

PORT=4000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
CLIENT_URL=http://localhost:3000


Or use the provided .env.example:

cp .env.example .env

4. Start the Server

npm start

The server will run at:

http://localhost:4000

✅ API Documentation
Swagger UI is available at:
http://localhost:4000/api/docs

✅ Main API Endpoints

| Resource        | Method | Endpoint                              | Description                  |
| --------------- | ------ | ------------------------------------- | ---------------------------- |
| **Auth**        | POST   | `/api/auth/register`                  | Register user                |
|                 | POST   | `/api/auth/login`                     | Login user                   |
| **Profile**     | GET    | `/api/user/profile`                   | Get user profile             |
|                 | PUT    | `/api/user/profile`                   | Update user profile          |
| **Scenarios**   | GET    | `/api/scenarios`                      | Get all scenarios            |
|                 | POST   | `/api/scenarios`                      | Create scenario (Admin)      |
|                 | POST   | `/api/scenarios/:scenarioId/complete` | Complete scenario & award XP |
| **Feedback**    | POST   | `/api/feedback`                       | Submit feedback              |
|                 | GET    | `/api/feedback/:userId`               | Get user feedback            |
| **Progress**    | GET    | `/api/progress/:userId`               | Get user progress            |
| **Self-Assess** | POST   | `/api/self-assessment`                | Submit self-assessment       |
|                 | GET    | `/api/self-assessment/:userId`        | Get user assessments         |

✅ Features
✔ JWT Authentication
✔ User Profile Management
✔ Scenario Management (CRUD + Completion)
✔ Gamification: XP, Levels, Badges, Streaks
✔ Feedback System
✔ Self-Assessment Module
✔ Progress Tracking
✔ Swagger API Docs

✅ Security Features
JWT Authentication for all protected routes

Role-based restrictions (Admin routes)

Helmet, CORS, Rate-limiting enabled


✅ License
MIT License

