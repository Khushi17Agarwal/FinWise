const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/finwise';

// Middleware
app.use(express.json());
app.use(cors());

// Mongo connection
mongoose
  .connect(MONGODB_URI, { dbName: 'finwise' })
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });

// User model
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, index: true },
    passwordHash: { type: String, required: true }
  },
  { timestamps: true }
);
const User = mongoose.model('User', userSchema);

// API routes
app.post('/api/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body || {};
    if (!name || !email || !password) {
      return res.status(400).json({ ok: false, message: 'Missing required fields' });
    }
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ ok: false, message: 'User already exists' });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, passwordHash });
    return res.status(201).json({ ok: true, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    console.error('Signup error:', err);
    return res.status(500).json({ ok: false, message: 'Server error' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ ok: false, message: 'Missing email or password' });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ ok: false, message: 'Invalid email or password' });
    }
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return res.status(401).json({ ok: false, message: 'Invalid email or password' });
    }
    return res.json({ ok: true, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ ok: false, message: 'Server error' });
  }
});

// Serve static frontend (same origin)
const staticDir = path.join(__dirname);
app.use(express.static(staticDir));

// Fallback to index for root
app.get('/', (_req, res) => {
  res.sendFile(path.join(staticDir, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});



