import mongoose from "mongoose";
import Task from "../models/Task.js";

export const createTask = async (req, res) => {
  try {
    const { title, completed } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Task title is required" });
    }

    const task = await Task.create({
      title,
      completed: completed ?? false,
      user: req.user._id,
    });

    return res.status(201).json(task);
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user._id }).sort({ createdAt: -1 });
    return res.status(200).json(tasks);
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid task ID" });
    }

    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this task" });
    }

    await Task.findByIdAndDelete(id);

    return res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};