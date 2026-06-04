import express from "express";
import { User } from "../models/user.model.js";
import z from "zod";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const signupBody = z.object({
    username: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters")
});

export const signUp = async (req, res) => {
    try {
        const validation = signupBody.safeParse(req.body);

        if (!validation.success) {
            return res.status(400).json({
                message: validation.error.errors[0].message
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
            secure: true,
            sameSite: "none",
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