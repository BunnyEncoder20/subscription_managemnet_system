import jwt from "jsonwebtoken";

import { JWT_SECRET } from "../config/env.js";
import { UserModel } from "../models/users.model.js";

const authorize = async (req, res, next) => {
    console.log("[server] req to autherized route...");
    try {
        let token;

        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer")
        ) {
            token = req.headers.authorization.split(" ")[1];
        }

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
