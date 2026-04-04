import express from "express";
import { addSleep } from "../controllers/sleep.controller.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

export const sleepRouter = express.Router();

sleepRouter.post("/addsleep",authMiddleware,addSleep);