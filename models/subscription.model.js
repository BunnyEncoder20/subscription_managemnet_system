import mongoose from "mongoose";
import dayjs from "dayjs";

const subscriptionSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Subscription name is required"],
            trim: true,
            minlength: [
                2,
                "Subscription name must be at least 2 characters long",
            ],
            maxlength: [100, "Subscription name cannot exceed 100 characters"],
        },
        price: {
            type: Number,
            required: [true, "Subscription price is required"],
            min: [0, "Subscription price must be greater than or equal to 0"],
            max: [
                1000000,
                "Subscription price cannot exceed 1,000,000. TF you buying???",
            ],
        },
        currency: {
            type: String,
            enum: ["INR", "USD", "EUR"],
            default: "INR",
        },
        frequency: {
            type: String,
            enum: ["daily", "weekly", "monthly", "yearly"],
            default: "monthly",
        },
        category: {
            type: String,
            enum: [
                "entertainment",
                "education",
                "health",
                "sports",
                "news",
                "finance",
                "technology",
                "lifestyle",
                "other",
            ],
            default: "entertainment",
            required: [true, "Subscription category is required"],
        },
        paymentMethod: {
            type: String,
            required: [true, "Payment method is required"],
            trim: true,
        },
        status: {
            type: String,
            enum: ["active", "expired", "cancelled"],
            default: "active",
        },
        startDate: {
            type: Date,
            required: [true, "Start date is required"],
            validate: {
                validator: function (value) {
                    return value <= new Date();
                },
                message: "Start date cannot be in the future",
            },
        },
        renewalDate: {
            type: Date,
            validate: {
                validator: function (value) {
                    // prevent crashing on undefined startDate or value
                    if (!value || !this.startDate) return true;
                    return value >= this.startDate;
                },
                message: "Renewal date cannot be before start date",
            },
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
    },
    { timestamps: true },
);

// Middleware: auto-calculate renewalDate and update status
subscriptionSchema.pre("save", function (next) {
    if (!this.renewalDate && this.startDate) {
        const daysToAdd = {
            daily: 1,
            weekly: 7,
            monthly: 30,
            yearly: 365,
        };

        const addedDays = daysToAdd[this.frequency] || 30; // fallback to 30 days if unknown

        this.renewalDate = dayjs(this.startDate).add(addedDays, "day").toDate(); // convert back to JS Date object
    }

    if (this.renewalDate && dayjs(this.renewalDate).isBefore(dayjs())) {
        this.status = "expired";
    }

    next();
});

const SubscriptionModel = mongoose.model("Subscription", subscriptionSchema);
export default SubscriptionModel;
