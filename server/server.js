const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const browserRoutes = require('./src/routes/browserRoutes');
const fileSystemRoutes = require('./src/routes/fileSystemRoutes');
const errorHandler = require('./src/utils/errorHandler');

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Emoji Logging Middleware
app.use((req, res, next) => {
  console.log(`🔥 ${req.method} ${req.url}`);
  next();
});

// Landing page
app.get('/', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Devon Backend</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            background-color: #f0f0f0;
          }
          .container {
            text-align: center;
            padding: 20px;
            background-color: white;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
          }
          h1 {
            color: #333;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>🚀 Devon Backend 🤖</h1>
          <p>Your AI-powered backend is up and running! 🎉</p>
        </div>
      </body>
    </html>
  `);
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: '🏥 Server is healthy!' });
});

// Routes
app.use('/api/browse', browserRoutes);
app.use('/api/fs', fileSystemRoutes);

// Error handling
app.use(errorHandler);

// Start the server
const server = app.listen(port, () => {
  console.log(`🚀 Server is running on port ${port}`);
});

// Reprint server health message on SIGUSER2 signal
process.on('SIGUSR2', () => {
  console.log(`\n🏥 Server health check at ${new Date().toISOString()}`);
  console.log(`🚀 Server is still running on port ${port}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM received. Shutting down gracefully');
  server.close(() => {
    console.log('💤 Server closed');
    process.exit(0);
  });
});