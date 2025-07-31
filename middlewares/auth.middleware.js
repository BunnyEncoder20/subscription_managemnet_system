import jwt from "jsonwebtoken";

import { JWT_SECRET } from "../config/env.js";
import UserModel from "../models/users.model.js";

const authMiddleware = async (req, res, next) => {
    console.log("[server] going through autherization check...");
    try {
        // If you getting the jwt token from the request header
        // let token;

        // if (
        //     req.headers.authorization &&
        //     req.headers.authorization.startsWith("Bearer")
        // ) {
        //     token = req.headers.authorization.split(" ")[1];
        // }

        // Using cookies for tokens (preferred in production)
        const token = req.cookies.access_token;

        if (!token) {
            console.debug("[server] no token was provided. Rejecting request.");
            return res.status(401).json({
                message: "Unauthorized",
            });
        }

        console.log("[server] decoding token...");
        const decoded = jwt.verify(token, JWT_SECRET);
        console.log("[server] done");

        console.log("[server] fetching user data...");
        const user = await UserModel.findById(decoded.userId);
        if (!user) {
            console.debug("[server] user not found. Rejecting request.");
            return res.status(401).json({
                message: "Unauthorized",
            });
        }
        console.log("[server] done");
        console.log("[server] Attached user data. Forwarding request");
        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({
            message: "Unauthorized",
            error: error.message,
        });
    }
};

export default authMiddleware;

export const verifyAdmin = (req, res, next) => {
    authMiddleware(req, res, () => {
        if (!req.user.isAdmin) {
            console.error(
                `[server] user:${req.user._id} is not an admin. Rejecting request.`,
            );
            const error = new Error(
                "You are not authorized to perform this action",
            );
            error.statusCode = 403;
            return next(error);
        }
        console.log(
            `[server] user:${req.user._id} is an admin. Allowing request.`,
        );
        next();
    });
};
