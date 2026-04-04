import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { generateWorkout, getWorkouts } from "../controllers/workout.controller.js";

export const workoutRouter = express.Router();

workoutRouter.post("/generateworkout",authMiddleware,generateWorkout)
workoutRouter.get("/getworkouts",getWorkouts);