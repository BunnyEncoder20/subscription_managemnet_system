import { Router } from "express";

import authMiddleware, { verifyAdmin } from "../middlewares/auth.middleware.js";
import {
    createSubscription,
    getAllSubscriptions,
    getSpecificSubscription,
    getUserSubscriptions,
    getUpcomingRenewals,
} from "../controllers/subscription.controller.js";

// endpoint's prefix: api/v1/subs
const subscriptionRouter = Router();

// Static routes first
subscriptionRouter.get("/", verifyAdmin, getAllSubscriptions);
subscriptionRouter.post("/", authMiddleware, createSubscription);

// TODO: Complete this route's controller
subscriptionRouter.get(
    "/upcoming-renewals",
    authMiddleware,
    getUpcomingRenewals,
);

// dynamic routes after
subscriptionRouter.get("/:id", verifyAdmin, getSpecificSubscription);

// TODO: Complete this route's controller
subscriptionRouter.put("/:id", (req, res) => {
    res.send({ message: "Update specific subscription" });
});

// TODO: Complete this route's controller
subscriptionRouter.delete("/:id", (req, res) => {
    res.send({ message: "DELETE specific subscription" });
});

// More dynamic routes
subscriptionRouter.get("/user/:id", authMiddleware, getUserSubscriptions);
// TODO: Complete this route's controller
subscriptionRouter.get("/cancel/:id", (req, res) => {
    res.send({ message: "CANCEL a specified subscription" });
});

export default subscriptionRouter;
