
import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import TaskModel, { ITask } from "../../models/task/TaskModel.ts";
import User, { UserDocument } from "../../models/auth/UserModel.ts"; // Import UserDocument
import mongoose from "mongoose";

interface AuthenticatedRequest extends Request {
  user?: UserDocument; 
}

export const createTask = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { title, description, dueDate, priority, status } = req.body;

    if (!title || title.trim() === "") {
      res.status(400).json({ message: "Title is required!" });
      return; 
    }

    if (!description || description.trim() === "") {
      res.status(400).json({ message: "Description is required!" });
      return;
    }

    // This checks if a task with the same title already exists for the user.
    const existingTask = await TaskModel.findOne({
      title: title.trim(),
      user: req.user?._id,
    });

    if (existingTask) {
      res
        .status(400)
        .json({ message: "A task with the same title already exists!" });
      return;
    }

    const task: ITask = new TaskModel({
      title: title.trim(),
      description: description.trim(),
      dueDate,
      priority,
      status,
      user: req.user?._id,
    });

    await task.save();

    res.status(201).json(task);
  }
);

// Get all tasks of the authenticated user

export const getTasks = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user?._id;

    if (!userId) {
      res.status(400).json({ message: "User not found!" });
      return;
    }

    const tasks = await TaskModel.find({ user: userId });

    res.status(200).json({
      length: tasks.length,
      tasks,
    });
  }
);

// Get a specific task from the authenticated user
export const getTask = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user?._id;
    const { id } = req.params;

    if (!id) {
      res.status(400).json({ message: "Please provide a task id" });
      return;
    }

    const task = await TaskModel.findById(id);

    if (!task) {
      res.status(404).json({ message: "Task not found!" });
      return;
    }

    if (!task.user.equals(userId)) {
      res.status(401).json({ message: "Not authorized!" });
      return;
    }

    res.status(200).json(task);
  }
);

// Update an existing task of the authenticated user
export const updateTask = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user?._id;
    const { id } = req.params;
    const { title, description, dueDate, priority, status, completed } =
      req.body;

    if (!id) {
      res.status(400).json({ message: "Please provide a task id" });
      return;
    }

    const task = await TaskModel.findById(id);

    if (!task) {
      res.status(404).json({ message: "Task not found!" });
      return;
    }

    if (!task.user.equals(userId)) {
      res.status(401).json({ message: "Not authorized!" });
      return;
    }

    task.title = title || task.title;
    task.description = description || task.description;
    task.dueDate = dueDate || task.dueDate;
    task.priority = priority || task.priority;
    task.status = status || task.status;
    task.completed = completed !== undefined ? completed : task.completed;

    await task.save();
    res.status(200).json(task);
  }
);

// Delete a specific task from the authenticated user
export const deleteTask = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user?._id;
    const { id } = req.params;

    const task = await TaskModel.findById(id);

    if (!task) {
      res.status(404).json({ message: "Task not found!" });
      return;
    }

    if (!task.user.equals(userId)) {
      res.status(401).json({ message: "Not authorized!" });
      return;
    }

    await TaskModel.findByIdAndDelete(id);
    res.status(200).json({ message: "Task deleted successfully!" });
  }
);

// Delete all tasks for the authenticated user
export const deleteAllTasks = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user?._id;

    const tasks = await TaskModel.find({ user: userId });

    if (!tasks.length) {
      res.status(404).json({ message: "No tasks found!" });
      return;
    }

    await TaskModel.deleteMany({ user: userId });
    res.status(200).json({ message: "All tasks deleted successfully!" });
  }
);
