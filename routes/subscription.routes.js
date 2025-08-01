import { Router } from "express";

import authMiddleware, { verifyAdmin } from "../middlewares/auth.middleware.js";
import {
    createSubscription,
    getAllSubscriptions,
    getSubscriptionById,
    updateSubscriptionById,
    getUserSubscriptionsById,
    deleteSubscriptionById,
    getUpcomingRenewals,
} from "../controllers/subscription.controller.js";

// endpoint's prefix: api/v1/subs
const subscriptionRouter = Router();

// Static routes first
subscriptionRouter.get("/", verifyAdmin, getAllSubscriptions);
subscriptionRouter.post("/", authMiddleware, createSubscription);

subscriptionRouter.get(
    "/upcoming-renewals",
    authMiddleware,
    getUpcomingRenewals,
);

// dynamic routes after
subscriptionRouter.get("/:id", verifyAdmin, getSubscriptionById);

// TODO: Complete this route's controller
subscriptionRouter.put("/:id", authMiddleware, updateSubscriptionById);

// TODO: Complete this route's controller
subscriptionRouter.delete("/:id", authMiddleware, deleteSubscriptionById);

// More dynamic routes
subscriptionRouter.get("/user/:id", authMiddleware, getUserSubscriptionsById);

export default subscriptionRouter;
