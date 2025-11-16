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

// Economic Calendar Proxy Endpoint
app.get('/api/economic-calendar', async (req, res) => {
  try {
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);
    
    const fromDate = today.toISOString().split('T')[0];
    const toDate = nextWeek.toISOString().split('T')[0];

    const apiKey = process.env.FMP_API_KEY || 'SyH64DFoPAlxsQALxLryFk5LvOyeUQuX';
    const apiUrl = `https://financialmodelingprep.com/api/v3/economic_calendar?from=${fromDate}&to=${toDate}&apikey=${apiKey}`;
    console.log(`📅 Date range: ${fromDate} to ${toDate}`);
    const nodeFetch = require('node-fetch');
    console.log(`📡 Fetching economic calendar from: ${apiUrl.replace(apiKey, 'API_KEY_HIDDEN')}`);
    let lastError = null;
    let response = await nodeFetch(apiUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'FinWise/1.0'
      }
    });
    let responseText = await response.text();
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      data = { error: responseText };
    }
    if (response.ok && Array.isArray(data) && data.length > 0) {
      console.log(`✅ Fetched ${data.length} economic events`);
      return res.json({ ok: true, events: data });
    } else {
      const errorMsg = data && (data['Error Message'] || data.error || data.message) || `HTTP ${response.status}`;
      lastError = `FMP: ${errorMsg}`;
    }

    const teUrl = `https://api.tradingeconomics.com/calendar?c=guest:guest&format=json&d1=${fromDate}&d2=${toDate}`;
    console.log(`📡 Fetching economic calendar fallback from: ${teUrl}`);
    const teRes = await nodeFetch(teUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'FinWise/1.0'
      }
    });
    const teText = await teRes.text();
    let teData;
    try {
      teData = JSON.parse(teText);
    } catch (e) {
      teData = { error: teText };
    }
    if (teRes.ok && Array.isArray(teData) && teData.length > 0) {
      const events = teData.map(item => ({
        country: item.Country || 'US',
        event: item.Event || item.Category || 'Economic Event',
        date: item.Date || item.Timestamp || null,
        estimate: item.Forecast !== undefined ? item.Forecast : item.Estimate,
        actual: item.Actual !== undefined ? item.Actual : null,
        previous: item.Previous !== undefined ? item.Previous : null,
        impact: item.Importance || null
      }));
      console.log(`✅ Fallback fetched ${events.length} economic events`);
      return res.json({ ok: true, events });
    } else {
      const teErr = teData && (teData.error || teData.message) || `HTTP ${teRes.status}`;
      const message = lastError ? `${lastError}; TE: ${teErr}` : `TE: ${teErr}`;
      return res.status(502).json({ ok: false, message });
    }
  } catch (err) {
    console.error('Economic calendar proxy error:', err.message);
    return res.status(500).json({ 
      ok: false, 
      message: 'Failed to fetch economic calendar data',
      error: err.message 
    });
  }
});

// Serve static frontend (same origin)
const staticDir = path.join(__dirname);
app.use(express.static(staticDir));

// Fallback to index for root
app.get('/', (_req, res) => {
  res.sendFile(path.join(staticDir, 'index.html'));
});

function startServer(p, tries = 0) {
  const server = app.listen(p, () => {
    console.log(`🚀 Server running at http://localhost:${p}`);
  });
  server.on('error', (err) => {
    if (err && err.code === 'EADDRINUSE' && tries < 10) {
      const next = p + 1;
      console.log(`⚠️  Port ${p} in use, retrying on ${next}`);
      startServer(next, tries + 1);
    } else {
      console.error('Server start error:', err && err.message ? err.message : err);
      process.exit(1);
    }
  });
}

startServer(PORT);


