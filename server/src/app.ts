import express, { Request, Response, NextFunction } from 'express';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/userRoutes.ts';
import taskRoutes from './routes/tasksRoutes.ts';
import protect from './middleware/authMiddleware.ts';

const app = express();

// Middlewares
app.use(express.json());
app.use(cookieParser());

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/tasks', protect, taskRoutes);

// Manejo de errores
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).json({ message: err.message });
});

export default app;
