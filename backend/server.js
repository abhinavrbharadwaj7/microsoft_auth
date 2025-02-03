const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const MicrosoftStrategy = require('passport-microsoft').Strategy;
const expressSanitizer = require('express-sanitizer');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const User = require('./models/User');
const app = express();

// Validate required environment variables
const requiredEnvVars = ['SESSION_SECRET', 'MONGODB_URI'];
requiredEnvVars.forEach(envVar => {
  if (!process.env[envVar] && process.env.NODE_ENV !== 'development') {
    console.error(`Missing required environment variable: ${envVar}`);
    process.exit(1);
  }
});

// CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGINS 
    ? process.env.CORS_ORIGINS.split(',') 
    : ['http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));
app.use(expressSanitizer());

// Rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false
});
app.use('/api/', apiLimiter);

// Session configuration
app.use(session({
  name: 'msauth.sid',
  secret: process.env.SESSION_SECRET || 'dev-secret', // Remove fallback in production
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 24 * 60 * 60 * 1000
  }
}));

// Passport setup
app.use(passport.initialize());
app.use(passport.session());

// Database connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
};
connectDB();

// Passport strategies (keep existing configuration)

// Rest of your code remains the same...
// Passport strategies
passport.use(new MicrosoftStrategy({
    clientID: process.env.AZURE_AD_CLIENT_ID,
    clientSecret: process.env.AZURE_AD_CLIENT_SECRET,
    callbackURL: process.env.AZURE_AD_REDIRECT_URI,
    scope: ['user.read'],
    tenant: 'common'
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      const user = await User.findOneAndUpdate(
        { microsoftId: profile.id },
        {
          displayName: profile.displayName,
          email: profile._json.email || profile.emails[0].value
        },
        { new: true, upsert: true, setDefaultsOnInsert: true }
      );
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  }));
  
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });
  
  // Enhanced logging middleware
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
  });
  
  // Routes
  app.get('/', (req, res) => {
    res.json({ status: 'active', timestamp: new Date().toISOString() });
  });
  
  app.get('/auth/microsoft', passport.authenticate('microsoft'));
  
  app.get('/auth/microsoft/callback', passport.authenticate('microsoft', {
    failureRedirect: '/login',
    session: true
  }), (req, res) => {
    res.redirect(process.env.FRONTEND_ORIGIN);
  });
  
  // Updated Profile API
  app.put('/api/profile', async (req, res) => {
    try {
      const sanitizedBody = {
        microsoftId: req.sanitize(req.body.microsoftId),
        displayName: req.sanitize(req.body.name),
        email: req.sanitize(req.body.email),
        phone: req.sanitize(req.body.phone),
        avatarUrl: req.sanitize(req.body.avatarUrl)
      };
  
      const user = await User.findOneAndUpdate(
        { microsoftId: sanitizedBody.microsoftId },
        sanitizedBody,
        { new: true, upsert: true, runValidators: true }
      );
  
      res.json({
        success: true,
        user: {
          id: user.id,
          displayName: user.displayName,
          email: user.email,
          phone: user.phone,
          avatarUrl: user.avatarUrl
        }
      });
    } catch (error) {
      console.error('Profile update error:', error);
      res.status(500).json({
        success: false,
        message: error.message.includes('validation') 
          ? 'Validation error: ' + error.message
          : 'Server error'
      });
    }
  });
  
  // Error handling
  app.use((err, req, res, next) => {
    console.error('Global error:', err);
    res.status(500).json({
      success: false,
      message: process.env.NODE_ENV === 'development' 
        ? err.message
        : 'Internal server error'
    });
  });
  
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });