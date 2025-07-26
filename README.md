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

| **Folder/File**     | **Description**                               |
| ------------------- | --------------------------------------------- |
| `src/`              | Main source folder                            |
| ├── `controllers/`  | Handles API requests and responses            |
| ├── `services/`     | Business logic (e.g., gamification, progress) |
| ├── `repositories/` | Database operations (MongoDB)                 |
| ├── `models/`       | Mongoose schemas for collections              |
| ├── `routes/`       | Express routes (Swagger docs included)        |
| ├── `middleware/`   | Auth, validation, and error handling          |
| ├── `config/`       | Swagger setup and XP configuration            |
| ├── `utils/`        | Logger and helper functions                   |
| `.env.example`      | Example environment variables file            |
| `.gitignore`        | Ignore files like `.env`, `node_modules`      |
| `server.js`         | Application entry point                       |
| `README.md`         | Project documentation                         |


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

| Resource      | Method | Endpoint                            | Description                 |
| ------------- | ------ | ----------------------------------- | --------------------------- |
| **Scenarios** | GET    | `/api/scenarios/adaptive`           | Get recommended scenario    |
|               | POST   | `/api/scenarios/:scenarioId/replay` | Replay scenario             |
|               | GET    | `/api/scenarios/skip`               | Skip current scenario       |
|               | GET    | `/api/scenarios/vr`                 | Get VR-compatible scenarios |
| **Goals**     | POST   | `/api/goals`                        | Create a goal               |
|               | GET    | `/api/goals`                        | Get user goals              |
|               | PUT    | `/api/goals/:goalId/progress`       | Update goal progress        |
|               | DELETE | `/api/goals/:goalId`                | Delete a goal               |
| **Dashboard** | GET    | `/api/user/dashboard`               | Get user progress dashboard |


## ** Features **
## ** JWT Authentication **
## **User Profile Management **
## ** Scenario Management (CRUD + Completion) **
## ** Gamification: XP, Levels, Badges, Streaks **
## ** Feedback System **
## ** Self-Assessment Module **
## ** Progress Tracking **
## ** Swagger API Docs **

✅ Security Features
JWT Authentication for all protected routes

Role-based restrictions (Admin routes)

Helmet, CORS, Rate-limiting enabled


✅ License
MIT License

