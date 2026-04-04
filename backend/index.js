import express from "express";
import dotenv from "dotenv";
import { connectDb } from "./config/db.js";
import { authRouter } from "./routes/authRouter.js";
import cookieParser from "cookie-parser";
import cors from "cors"
import { userRouter } from "./routes/userRouter.js";
import { bmiRouter } from "./routes/bmiRouter.js";
import { workoutRouter } from "./routes/workoutRouter.js";
import { sleepRouter } from "./routes/sleepRouter.js";
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser())

app.use("/api/auth",authRouter);
app.use("/api/user",userRouter);
app.use("/api/bmi",bmiRouter);
app.use("/api/workout",workoutRouter);
app.use("/api/sleep",sleepRouter);


const PORT = process.env.PORT||5000;

app.listen(PORT,()=>{
    console.log(`Listening on PORT ${PORT}`);
    connectDb()
})