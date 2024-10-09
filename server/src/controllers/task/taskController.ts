import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import TaskModel, { ITask } from '../../models/task/TaskModel.ts';

interface AuthenticatedRequest extends Request {
  user?: {
    _id: string;
  };
}

export const createTask = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { title, description, dueDate, priority, status } = req.body;

    if (!title || title.trim() === '') {
      return res.status(400).json({ message: 'Title is required!' });
    }

    if (!description || description.trim() === '') {
      return res.status(400).json({ message: 'Description is required!' });
    }

    const task: ITask = new TaskModel({
      title,
      description,
      dueDate,
      priority,
      status,
      user: req.user?._id,
    });

    await task.save();

    res.status(201).json(task);
  } catch (error) {
    console.log('Error in createTask: ', (error as Error).message);
    res.status(500).json({ message: (error as Error).message });
  }
});

export const getTasks = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res.status(400).json({ message: 'User not found!' });
    }

    const tasks = await TaskModel.find({ user: userId });

    res.status(200).json({
      length: tasks.length,
      tasks,
    });
  } catch (error) {
    console.log('Error in getTasks: ', (error as Error).message);
    res.status(500).json({ message: (error as Error).message });
  }
});

export const getTask = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?._id;
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: 'Please provide a task id' });
    }

    const task = await TaskModel.findById(id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found!' });
    }

    if (!task.user.equals(userId)) {
      return res.status(401).json({ message: 'Not authorized!' });
    }

    res.status(200).json(task);
  } catch (error) {
    console.log('Error in getTask: ', (error as Error).message);
    res.status(500).json({ message: (error as Error).message });
  }
});

export const updateTask = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?._id;
    const { id } = req.params;
    const { title, description, dueDate, priority, status, completed } = req.body;

    if (!id) {
      return res.status(400).json({ message: 'Please provide a task id' });
    }

    const task = await TaskModel.findById(id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found!' });
    }

    if (!task.user.equals(userId)) {
      return res.status(401).json({ message: 'Not authorized!' });
    }

    task.title = title || task.title;
    task.description = description || task.description;
    task.dueDate = dueDate || task.dueDate;
    task.priority = priority || task.priority;
    task.status = status || task.status;
    task.completed = completed !== undefined ? completed : task.completed;

    await task.save();

    return res.status(200).json(task);
  } catch (error) {
    console.log('Error in updateTask: ', (error as Error).message);
    res.status(500).json({ message: (error as Error).message });
  }
});

export const deleteTask = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?._id;
    const { id } = req.params;

    const task = await TaskModel.findById(id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found!' });
    }

    if (!task.user.equals(userId)) {
      return res.status(401).json({ message: 'Not authorized!' });
    }

    await TaskModel.findByIdAndDelete(id);

    return res.status(200).json({ message: 'Task deleted successfully!' });
  } catch (error) {
    console.log('Error in deleteTask: ', (error as Error).message);
    res.status(500).json({ message: (error as Error).message });
  }
});

export const deleteAllTasks = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?._id;

    const tasks = await TaskModel.find({ user: userId });

    if (!tasks.length) {
      return res.status(404).json({ message: 'No tasks found!' });
    }

    await TaskModel.deleteMany({ user: userId });

    return res.status(200).json({ message: 'All tasks deleted successfully!' });
  } catch (error) {
    console.log('Error in deleteAllTasks: ', (error as Error).message);
    res.status(500).json({ message: (error as Error).message });
  }
});