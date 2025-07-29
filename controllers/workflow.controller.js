import { createRequire } from "module"; // we create a require so that can import the upstash 'serve'
const require = createRequire(import.meta.url); // but cause we specific "module" in our package.json type, we can only use imports
const { serve } = require("@upstash/workflow/express"); // just for this "require"
import dayjs from "dayjs";

import SubscriptionModel from "../models/subscription.model";

const REMINDERS = [7, 5, 2, 1];

export const sendReminders = serve(async (context) => {
    const { subscriptionId } = context.requestPayload;
    console.log(
        `[upstash] setting workflow for subscriptionId:${subscriptionId}`,
    );

    const subscription = await fetchSubscription(context, subscriptionId);

    if (!subscription || subscription.status !== "active") {
        console.debug(
            `[upstash] the subscriptionId:${subscriptionId} is either not active or wasn't created. Aborting workflow`,
        );
        return;
    }

    const renewalDate = dayjs(subscription.renewalDate);

    // check if the renewalDate is before current date and time
    if (renewalDate.isBefore(dayjs())) {
        console.debug(
            `[upstash] renewal date for subscriptionId:${subscriptionId} has already passed. Aborting workflow`,
        );
        return;
    }

    console.log(
        `[upstash] subscription:${subscriptionId} has valid renewwal date. Making workflows reminders...`,
    );
    for (const daysBefore of REMINDERS) {
        // using dayjs obj, can substract(days, unit) dayBefore from renewal date
        const reminderDate = renewalDate.subtract(daysBefore, "day");

        // schedule reminder if reminder date is after current datetime
        if (reminderDate.isAfter(dayjs())) {
            // schedule reminder
            console.log(
                `[upstash] setting reminder for ${daysBefore} days before for subscriptionId:${subscriptionId}.`,
            );
            await sleepUntilReminder(
                context,
                `Reminder ${daysBefore} days before`,
                reminderDate,
            );

            // Trigger Reminder
            console.log(
                `[upstash] triggering reminder for ${daysBefore} days before for subscriptionId:${subscriptionId}.`,
            );
            await triggerReminder(
                context,
                `Reminder for ${daysBefore} days before`,
            );
        }
    }

    console.log(
        `[upstash] workflow for subscriptionId:${subscriptionId} has completed`,
    );
});

const fetchSubscription = async (context, subscriptionId) => {
    return await context.run("get subscription", () => {
        return SubscriptionModel.findById(subscriptionId).populate(
            "user", // get user data
            "name email", // specifically name and email
        );
    });
};

const sleepUntilReminder = async (context, label, date) => {
    console.log(`[upstash] sleeping until ${label} reminder at ${date}`);
    await context.sleepUntil(label, date.toDate());
};

const triggerReminder = async (context, label) => {
    return await context.run(label, () => {
        console.log(`[upstash] triggering ${label} reminder`);
        // TODO: send email, sms, pushnotification...
    });
};
