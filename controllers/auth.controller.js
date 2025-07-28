import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import UserModel from "../models/users.model.js ";
import { JWT_EXPIRY_IN, JWT_SECRET } from "../config/env.js";

export const signUp = async (req, res, next) => {
    // open up mongoose transaction session (for ATOMIC DB updates)
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // create a new user
        const { name, email, password } = req.body;

        // exception: check if user already exists
        const exisitingUser = await UserModel.findOne({ email });
        if (exisitingUser) {
            const error = new Error("User already exists");
            error.statusCode = 409;
            throw error;
        }

        // hashing the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // create a new user | Attached with a session so that it can be aborted if any error occurs
        const newUsers = await UserModel.create(
            [{ name, email, hashedPassword }],
            { session },
        );

        const token = jwt.sign({ userId: newUsers[0]._id }, JWT_SECRET, {
            expiresIn: JWT_EXPIRY_IN,
        });

        await session.commitTransaction();
        session.endSession();

        res.status(201).json({
            success: true,
            message: "User created successfully",
            data: {
                token,
                user: newUsers[0],
            },
        });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        next(error);
    }
};

export const signIn = async (req, res, next) => {
    // TODO: Implement user signup logic
};

export const signOut = async (req, res, next) => {
    // TODO: Implement user signup logic
};
