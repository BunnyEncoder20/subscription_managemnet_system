import express from "express";
import { PORT } from "./config/env.js";

const app = express();

app.get("/", (req, res) => {
    res.send("Hello World. This is Subscription Management");
});

app.listen(PORT, () => {
    console.log(`Subscription Tracker API is running: http:localhost:${PORT}`);
});

export default app;
