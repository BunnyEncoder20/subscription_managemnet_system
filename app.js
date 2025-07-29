import express from "express";
import cookieParser from "cookie-parser";

import { PORT } from "./config/env.js";
import userRouter from "./routes/user.routes.js";
import authRouter from "./routes/auth.routes.js";
import subscriptionRouter from "./routes/subscription.routes.js";
import connect2database from "./database/connection.js";
import errorMiddleware from "./middlewares/error.middleware.js";
import arcjetMiddleware from "./middlewares/arcjet.middleware.js";

const app = express();

// 🔒 Arcjet first (before body parsing, routing)
app.use(arcjetMiddleware);

// 🔧 Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// 🚀 Routes
app.get("/", (req, res) => {
    res.send("Hello World. This is Subscription Management");
});
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/subs", subscriptionRouter);

// ❗ Global error handler last
app.use(errorMiddleware);

// Server Listening
app.listen(PORT, async () => {
    console.log(
        `[server] Subscription Management API is running: http://localhost:${PORT}`,
    );
    await connect2database();
});

export default app;
