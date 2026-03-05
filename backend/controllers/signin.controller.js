import z from "zod";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const signinBody = z.object({
    email: z.email(),
    password: z.string().min(6)
});

export const signIn = async (req, res) => {
    try {
        const { success } = signinBody.safeParse(req.body);

        if (!success) {
            return res.status(400).json({
                message: "Signin validation failed"
            });
        }

        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

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

        return res.status(200).json({
            message: "Signed in successfully"
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

