import express from "express";

import { PORT } from "./config/env.js";
import userRouter from "./routes/user.routes.js";
import authRouter from "./routes/auth.routes.js";
import subscriptionRouter from "./routes/subscription.routes.js";

const app = express();

app.get("/", (req, res) => {
    res.send("Hello World. This is Subscription Management");
});

// routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/subs", subscriptionRouter);

// Server Listening
app.listen(PORT, () => {
    console.log(
        `Subscription Tracker API is running: http://localhost:${PORT}`,
    );
});

export default app;
