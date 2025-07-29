import { Router } from "express";

import authorizationMiddleware from "../middlewares/auth.middleware.js";
import { createSubscription } from "../controllers/subscription.controller.js";

// endpoint's prefix: api/v1/subs
const subscriptionRouter = Router();

subscriptionRouter.get("/", (req, res) => {
    res.send({ message: "GET all subscriptions" });
});

subscriptionRouter.get("/:id", (req, res) => {
    res.send({ message: "GET specific subscriptions" });
});

subscriptionRouter.post("/", authorizationMiddleware, createSubscription);

subscriptionRouter.put("/:id", (req, res) => {
    res.send({ message: "Update specific subscription" });
});

subscriptionRouter.delete("/:id", (req, res) => {
    res.send({ message: "DELETE specific subscription" });
});

subscriptionRouter.get("/user/:id", (req, res) => {
    res.send({ message: "GET all subscriptions of specific user" });
});

subscriptionRouter.get("/:id/cancel", (req, res) => {
    res.send({ message: "CANCEL a specified subscription" });
});

subscriptionRouter.get("/upcoming-renewals", (req, res) => {
    res.send({ message: "GET all upcoming (due) renewals " });
});

export default subscriptionRouter;
