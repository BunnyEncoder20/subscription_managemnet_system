import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import UserModel from "../models/users.model.js ";
import { NODE_ENV, JWT_EXPIRY_IN, JWT_SECRET } from "../config/env.js";

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
        const newUser = newUsers[0];

        console.log("[server] creating new jwt token...");
        const token = jwt.sign({ userId: newUser._id }, JWT_SECRET, {
            expiresIn: JWT_EXPIRY_IN,
        });

        // remove password from user object
        newUser.password = undefined;

        console.log("[server] commiting session changes...");
        await session.commitTransaction();
        session.endSession();

        console.log(`[server] user ${name} was created successfully`);
        res.status(201)
            .cookie("access_token", token, {
                httpOnly: true,
                secure: NODE_ENV === "production", // will allow to send cookie over http in development | in production, only sent cookies over https
            })
            .json({
                success: true,
                message: "User created successfully",
                data: {
                    user: newUser,
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

        const user = await UserModel.findOne({ email }).select("+password"); // just for sign in we call the user obj with password to verify credentials. After that we remove it.
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

        // remove password from user object
        user.password = undefined;

        console.log(`[server] user:${user._id} signed in successfully`);
        res.status(200)
            .cookie("access_token", token, {
                httpOnly: true,
                secure: NODE_ENV === "production",
            })
            .json({
                success: true,
                message: "user signed in successfully",
                data: {
                    user,
                },
            });
    } catch (error) {
        next(error);
    }
};

export const signOut = async (req, res, next) => {
    try {
        console.log(`[server] user:${req.user._id} signing out.`);
        res.status(200)
            .clearCookie("access_token") // clears the cookie which has the auth jwt to sign out
            .json({
                success: true,
                message: "User signed out successfully",
            });
    } catch (error) {
        next(error);
    }
};
