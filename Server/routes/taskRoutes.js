import express from "express";
import {
  createTask,
  updateTask,
  deleteTask,
  getTasks,
} from "../controllers/taskController.js";
import  protect  from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").get(protect, getTasks).post(protect, createTask);

router.route("/:id").put(protect, updateTask).delete(protect, deleteTask);

export default router;
