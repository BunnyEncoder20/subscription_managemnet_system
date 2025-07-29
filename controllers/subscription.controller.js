import SubscriptionModel from "../models/subscription.model.js";

export const getAllSubscriptions = async (req, res, next) => {
    console.log(
        `[server] req for list of all subscriptions data by user:${req.user._id}`,
    );
    try {
        // TODO: Add admin check for these data routes
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

        res.status(201).json({
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
