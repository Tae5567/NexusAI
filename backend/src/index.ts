import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import chatRoutes from './routes/chat';
import documentRoutes from './routes/documents';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'ai-customer-support',
  });
});

// Routes
app.use('/api/chat', chatRoutes);
app.use('/api/documents', documentRoutes);

// Error handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════╗
║  AI Customer Support System - Backend API    ║
║  Port: ${PORT}                                ║
║  Environment: ${process.env.NODE_ENV || 'development'}            ║
╚═══════════════════════════════════════════════╝

🚀 Server is running!
📡 API: http://localhost:${PORT}
💚 Health: http://localhost:${PORT}/health
📚 Chat: http://localhost:${PORT}/api/chat
📄 Docs: http://localhost:${PORT}/api/documents
  `);
});

export default app;