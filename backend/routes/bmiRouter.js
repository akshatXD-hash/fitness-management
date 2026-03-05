import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { addBmi, getBmi } from "../controllers/bmi.controller.js";

export const bmiRouter = express.Router();

bmiRouter.post("/addbmi",authMiddleware,addBmi);
bmiRouter.get("/getbmi",authMiddleware,getBmi)