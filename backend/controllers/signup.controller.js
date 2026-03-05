import express from "express";
import { User } from "../models/user.model.js";
import z from "zod";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const signupBody = z.object({
    username: z.string().min(6),
    email: z.email(),
    password: z.string().min(6)
});

export const signUp = async (req, res) => {
    try {
        const { success } = signupBody.safeParse(req.body);

        if (!success) {
            return res.status(400).json({
                message: "Zod validation failed"
            });
        }

        const { username, email, password } = req.body;

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(409).json({
                message: "User already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            username,
            email,
            password: hashedPassword
        });

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "3d" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 3 * 24 * 60 * 60 * 1000
        });

        return res.status(201).json({
            message: "User created successfully"
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
};