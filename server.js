const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./src/config/db');
const cors = require('cors');
const morgan = require('morgan');

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

app.use((req, res, next) => {
  console.log(`DEBUG: Incoming ${req.method} ${req.url}`);
  next();
});


// Basic Route
app.get('/', (req, res) => {
  res.send('SocialEase API is running...');
});

const PORT = process.env.PORT || 3000;

const authRoutes = require('./src/routes/authRoutes');
app.use('/api/auth', authRoutes);

const scenarioRoutes = require('./src/routes/scenarioRoutes');
app.use('/api/scenarios', scenarioRoutes);

const progressRoutes = require('./src/routes/progressRoutes');
app.use('/api/progress', progressRoutes);


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
