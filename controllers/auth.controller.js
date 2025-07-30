import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import UserModel from "../models/users.model.js ";
import { JWT_EXPIRY_IN, JWT_SECRET } from "../config/env.js";

export const signUp = async (req, res, next) => {
    console.log(
        `[server] req for user sign-up received for email: ${req.body.email}`,
    );

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
        console.log("[server] Hashing password...");
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // create a new user | Attached with a session so that it can be aborted if any error occurs
        console.log("[server] creating new user...");
        const newUsers = await UserModel.create(
            [{ name, email, password: hashedPassword }],
            { session },
        );

        console.log("[server] creating new jwt token...");
        const token = jwt.sign({ userId: newUsers[0]._id }, JWT_SECRET, {
            expiresIn: JWT_EXPIRY_IN,
        });

        console.log("[server] commiting session changes...");
        await session.commitTransaction();
        session.endSession();

        console.log(`[server] user ${name} was created successfully`);
        res.status(201).json({
            success: true,
            message: "User created successfully",
            data: {
                token,
                user: newUsers[0],
            },
        });
    } catch (error) {
        console.debug("[server] an error occured why creating new user.");
        console.debug("[server] session is aborting transaction...");

        await session.abortTransaction();
        session.endSession();
        next(error);
    }
};

export const signIn = async (req, res, next) => {
    console.log(`[server] req to sign in by user:${req.body.email}`);
    try {
        const { email, password } = req.body;

        const user = await UserModel.findOne({ email });
        if (!user) {
            const error = new Error("user not found");
            error.statusCode = 404;
            throw error;
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            const error = new Error("invalid password");
            error.statusCode = 401;
            throw error;
        }

        // valid credentials: generating token
        console.log(`[server] generating token for user:${user._id}`);
        const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
            expiresIn: JWT_EXPIRY_IN,
        });

        console.log(`[server] user:${email} signed in successfully`);
        res.status(200).json({
            seccess: true,
            message: "user signed in successfully",
            data: {
                token,
                user,
            },
        });
    } catch (error) {
        next(error);
    }
};

export const signOut = async (req, res, next) => {
    // TODO: Implement user signOut controller
};
