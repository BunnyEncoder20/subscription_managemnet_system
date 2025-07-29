import SubscriptionModel from "../models/subscription.model.js";

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
