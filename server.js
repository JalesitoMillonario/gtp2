const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();

// ✅ CORS
app.use(cors());

// ✅ Aceptar JSON y texto plano como JSON
app.use(
  express.json({
    type: ['application/json', 'text/plain'],
    limit: '2mb',
  })
);

// ✅ Aceptar formularios también
app.use(express.urlencoded({ extended: true }));

// ✅ Servir archivos estáticos
app.use('/uploads', express.static('uploads'));

// ✅ Rutas principales
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/upload', require('./routes/upload'));
app.use('/api/lessons', require('./routes/lessons'));
app.use('/api/progress', require('./routes/progress'));
app.use('/api/files', require('./routes/files'));
app.use('/api/payments', require('./routes/payments'));

// ✅ Ruta de estado
app.get('/api', (req, res) => {
  res.json({
    status: '✅ API curso_api funcionando correctamente',
    version: '1.0.0',
  });
});

// ✅ Log de cuerpo recibido (solo debug, opcional)
app.use((req, res, next) => {
  if (req.originalUrl.includes('/auth/login') || req.originalUrl.includes('/auth/register')) {
    console.log('📩 BODY RECIBIDO:', req.body);
  }
  next();
});

// ✅ Middleware global de errores
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.message);
  res
    .status(err.status || 500)
    .json({ error: err.message || 'Internal Server Error' });
});

// ✅ Lanzar servidor
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 API corriendo en puerto ${PORT}`));
