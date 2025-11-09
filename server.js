require('dotenv').config();
const express = require('express');
const cors = require('cors');
const passport = require('./config/passport');
const path = require('path');
const os = require('os');
const app = express();

// ✅ CORS
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:3000',
    process.env.FRONTEND_URL || 'http://localhost:5173',
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

// ✅ Servir archivos estáticos
app.use('/uploads', express.static('uploads'));
app.use('/uploads/videos', express.static(path.join(__dirname, 'uploads/videos')));

// ✅ Servir videos desde ~/videos
const homeVideosPath = path.join(os.homedir(), 'videos');
console.log(`📹 Sirviendo videos desde: ${homeVideosPath}`);
app.use('/videos', express.static(homeVideosPath));

// 🧩 Rutas principales
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/upload', require('./routes/upload'));
app.use('/api/lessons', require('./routes/lessons'));
app.use('/api/progress', require('./routes/progress'));
app.use('/api/files', require('./routes/files'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/videos', require('./routes/videos'));

// 🔁 Alias OAuth
app.use('/auth', require('./routes/auth'));

app.get('/api', (req, res) => {
  res.json({ 
    status: '✅ API curso_api funcionando correctamente', 
    version: '1.0.0'
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 🧯 Middleware de errores
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.message);
  console.error('Stack:', err.stack);
  res.status(err.status || 500).json({ 
    error: err.message || 'Internal Server Error'
  });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 API corriendo en puerto ${PORT}`);
  console.log(`📍 Base URL: ${process.env.BASE_URL}`);
  console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL}`);
});
