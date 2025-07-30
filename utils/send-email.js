import dayjs from "dayjs";

import { emailTemplates } from "./email-template.js";
import { EMAIL } from "../config/env.js";
import { transporter } from "../config/nodemailer.js";

export const sendReminderEmail = async ({ to, type, subscription }) => {
    if (!to || !type) {
        console.debug(
            "[email] cannot send email without required parameters. check {to, type}",
        );
        throw new Error("Missing required parameters for email reminder");
    }

    const template = emailTemplates.find((t) => t.label === type);
    if (!template) {
        console.debug(`[email] invalid email template type:${type}`);
        throw new Error("Invalid email template (type)");
    }

    console.log(`[email] sending reminder email to ${to} for type ${type}`);

    const mailInfo = {
        userName: subscription.user.name,
        subscriptionName: subscription.name,
        renewalDate: dayjs(subscription.renewalDate).format("MMM DD, YYYY"),
        planName: subscription.name,
        price: `${subscription.currency} ${subscription.price} (${subscription.frequency})`,
        paymentMethod: subscription.paymentMethod,
    };

    console.log("[email] generating email body");
    const message = template.generateBody(mailInfo);
    console.log("[email] done");

    console.log("[email] generating email subject");
    const subject = template.generateSubject(mailInfo);
    console.log("[email] done");

    const mailOptions = {
        from: EMAIL,
        to: to,
        subject: subject,
        html: message,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error(error, "There was an error sending the email");
        }
        console.log("[server] email sent: ", info.response);
    });
};
