import express from "express";
import { signUp } from "../controllers/signup.controller.js";
import { signIn } from "../controllers/signin.controller.js";

export const authRouter = express.Router();



authRouter.post("/signup",signUp)
authRouter.post("/signin",signIn)