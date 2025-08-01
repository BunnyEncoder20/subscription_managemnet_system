import { workflowClient } from "../config/upstash.js";
import SubscriptionModel from "../models/subscription.model.js";
import { SERVER_URL } from "../config/env.js";

export const getAllSubscriptions = async (req, res, next) => {
    console.log(
        `[server] req for list of all subscriptions data by user:${req.user._id}`,
    );
    try {
        const subscriptions = await SubscriptionModel.find();
        console.log(`[server] fetched ${subscriptions.length} subscriptions`);
        res.status(200).json({
            success: true,
            data: subscriptions,
        });
    } catch (error) {
        next(error);
    }
};

export const createSubscription = async (req, res, next) => {
    console.log(
        `[server] req for creating subscription:${req.body.name} from user:${req.user._id}`,
    );
    try {
        const subscription = await SubscriptionModel.create({
            ...req.body,
            user: req.user._id,
        });
        console.log("[server] created subscription");

        console.log("[server] setting workflow reminder...");
        const { workflowRunId } = await workflowClient.trigger({
            url: `${SERVER_URL}/api/v1/workflows/subscription/reminder`,
            body: {
                subscriptionId: subscription._id,
            },
            headers: {
                "content-type": "application/json",
            },
            retries: 0,
        });
        console.log("[server] done");

        res.status(201).json({
            success: true,
            data: { subscription, workflowRunId },
        });
    } catch (error) {
        next(error);
    }
};

export const getSpecificSubscription = async (req, res, next) => {
    console.log(
        `[server] req for subscription:${req.params.id} from user:${req.user._id}`,
    );
    try {
        const subscription = await SubscriptionModel.findById(req.params.id);

        if (!subscription) {
            console.log(
                `[server] subscription:${req.params.id} could not be found`,
            );
            const error = new Error(`subscription:${req.params.id} not found`);
            error.status = 404;
            next(error);
        }

        console.log(
            `[server] fetched subsciption:${subscription._id} successfully`,
        );
        res.status(200).json({
            success: true,
            data: subscription,
        });
    } catch (error) {
        next(error);
    }
};

export const getUserSubscriptions = async (req, res, next) => {
    console.log(
        "[server] req for list of subscriptions of user:",
        req.params.id,
    );

    try {
        if (req.user.id !== req.params.id) {
            console.error(
                `[server] user:${req.user._id} tried to access another user's subscriptions`,
            );
            const error = new Error(
                "You are not the owner of this account. You can ONLY get YOUR list of subscriptions.",
            );
            error.status = 401;
            throw error;
        }

        const subscriptions = await SubscriptionModel.find({
            user: req.params.id,
        });
        res.status(200).json({
            success: true,
            data: subscriptions,
        });
    } catch (error) {
        next(error);
    }
};

export const getUpcomingRenewals = async (req, res, next) => {
    console.log(
        `[server] req to fetch upcoming subs renewals for user:${req.user._id}`,
    );

    try {
        const upcomingRenewals = await SubscriptionModel.find({
            user: req.user._id,
            status: "active",
            nextRenewalDate: { $gte: new Date() },
        })
            .sort({ nextRenewalDate: 1 }) // sort in chronological order
            .limit(parseInt(req.params.limit || 10)) // limit queries if limit given in params else 10
            .offset(parseInt(req.params.offset || 0)) // offset queries if offset given in params else 0
            .select("name plan amount nextRenewalDate"); // select only required fields

        console.log("[server] fetched upcoming renewals successfully");
        res.status(200).json({
            success: true,
            data: upcomingRenewals,
        });
    } catch (error) {
        next(error);
    }
};
