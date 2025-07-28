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

app.get("/", (req, res) => {
    res.send("Hello World. This is Subscription Management");
});

// Middleware
app.use(express.json()); // allows api to handle json data sent
app.use(express.urlencoded({ extended: false })); // allows api to handle url encoded data (from html forms) sent
app.use(cookieParser()); // reads cookies from incoming requests so app can store user data
app.use(errorMiddleware); // global erorr handler
app.use(arcjetMiddleware); // rate limiting, bot detection, etc

// routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/subs", subscriptionRouter);

// Server Listening
app.listen(PORT, async () => {
    console.log(
        `[server] Subscription Management API is running: http://localhost:${PORT}`,
    );
    await connect2database();
});

export default app;
