import express from "express";
import Task from "../models/Task.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Apply auth middleware
router.use(authMiddleware);

// POST /api/tasks
router.post("/", async (req, res) => {
  try {
    const { title, description, completed } = req.body;

    // Create task
    const task = await Task.create({
      title,
      description,
      completed,
      owner: req.user._id, // Attach owner = req.user._id
    });

    return res.status(201).json(task);
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
});

// GET /api/tasks
router.get("/", async (req, res) => {
  try {
    // Return only tasks belonging to req.user
    const tasks = await Task.find({ owner: req.user._id }).sort({ createdAt: -1 });

    return res.status(200).json(tasks);
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
});

// DELETE /api/tasks/:id
router.delete("/:id", async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Check ownership
    if (task.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this task" });
    }

    // Delete task
    await Task.findByIdAndDelete(req.params.id);

    return res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
});

export default router;