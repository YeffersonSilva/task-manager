import express from 'express';
import {
  createTask,
  deleteTask,
  getTask,
  getTasks,
  updateTask,
} from '../controllers/task/taskController.ts';
import protect from '../middleware/authMiddleware.ts';

const router = express.Router();

router.post('/task/create', protect, createTask);
router.get('/tasks', protect, getTasks);
router.get('/task/:id', protect, getTask);
router.patch('/task/:id', protect, updateTask);
router.delete('/task/:id', protect, deleteTask);

export default router;