import express from "express";

import { PORT } from "./config/env.js";
import userRouter from "./routes/user.routes.js";
import authRouter from "./routes/auth.routes.js";
import subscriptionRouter from "./routes/subscription.routes.js";
import connect2database from "./database/connection.js";
import errorMiddleware from "./middlewares/error.middleware.js";
import cookieParser from "cookie-parser";

const app = express();

app.get("/", (req, res) => {
    res.send("Hello World. This is Subscription Management");
});

// Middleware
app.use(express.json()); // allows api to handle json data sent
app.use(express.urlencoded({ extended: false })); // allows api to handle url encoded data (from html forms) sent
app.use(cookieParser()); // reads cookies from incoming requests so app can store user data
app.use(errorMiddleware);

// routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/subs", subscriptionRouter);

// Server Listening
app.listen(PORT, async () => {
    console.log(
        `Subscription Tracker API is running: http://localhost:${PORT}`,
    );
    await connect2database();
});

export default app;
