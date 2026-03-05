import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { getUser } from "../controllers/user.controller.js";

export const userRouter = express.Router();

userRouter.get("/getuser",authMiddleware,getUser)