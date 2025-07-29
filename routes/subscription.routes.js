import { Router } from "express";

import authorizationMiddleware from "../middlewares/auth.middleware.js";
import {
    createSubscription,
    getAllSubscriptions,
    getSpecificSubscription,
    getUserSubscriptions,
} from "../controllers/subscription.controller.js";

// endpoint's prefix: api/v1/subs
const subscriptionRouter = Router();

// Static routes first
subscriptionRouter.get("/", authorizationMiddleware, getAllSubscriptions);
subscriptionRouter.post("/", authorizationMiddleware, createSubscription);
subscriptionRouter.get("/upcoming-renewals", (req, res) => {
    res.send({ message: "GET all upcoming (due) renewals " });
});

// dynamic routes after
subscriptionRouter.get(
    "/:id",
    authorizationMiddleware,
    getSpecificSubscription,
);
subscriptionRouter.put("/:id", (req, res) => {
    res.send({ message: "Update specific subscription" });
});
subscriptionRouter.delete("/:id", (req, res) => {
    res.send({ message: "DELETE specific subscription" });
});

// More dynamic routes
subscriptionRouter.get(
    "/user/:id",
    authorizationMiddleware,
    getUserSubscriptions,
);
subscriptionRouter.get("/cancel/:id", (req, res) => {
    res.send({ message: "CANCEL a specified subscription" });
});

export default subscriptionRouter;
