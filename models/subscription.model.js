import mongoose from "mongoose";

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
            enum: ["DAILY", "WEEKLY", "MONTHLY", "YEARLY"],
            default: "MONTHLY",
        },
        category: {
            type: String,
            enum: [
                "ENTERTAINMENT",
                "EDUCATION",
                "HEALTH",
                "SPORTS",
                "NEWS",
                "FINANCE",
                "TECHNOLOGY",
                "LIFESTYLE",
                "OTHER",
            ],
            default: "ENTERTAINMENT",
            required: [true, "Subscription category is required"],
        },
        paymentMethod: {
            type: String,
            required: [true, "Payment method is required"],
            trim: true,
        },
        status: {
            type: String,
            enum: ["ACTIVE", "EXPIRED", "CANCELLED"],
            default: "ACTIVE",
        },
        startDate: {
            type: Date,
            required: true,
            validate: {
                validatorFunc: (value) => value <= new Date(),
                message: "Start date cannot be in the future",
            },
        },
        renewalDate: {
            type: Date,
            validate: {
                validatorFunc: function (value) {
                    value > this.startDate;
                },
                message: "Renewal date cannot be before start date",
            },
        },
        user: {
            type: mongoose.Schema.Types.ObjectId, // reference to User model
            ref: "User", // remember this is the Name passed onto MongoDB (not the js variable name)
            required: true,
            index: true,
        },
    },
    { timestamps: true },
);

// automatically, run this function (before saving a new record) renewal date
subscriptionSchema.pre("save", function (next) {
    // calculate the renewal date if not provided already
    if (!this.renewalDate) {
        const renewalPeriods = {
            DAILY: 1,
            WEEKLY: 7,
            MONTHLY: 30,
            YEARLY: 365,
        };
        this.renewalDate = new Date(this.startDate);
        this.renewalDate.setDate(
            this.renewalDate.getDate() + renewalPeriods[this.frequency],
        );
    }

    // auto-update the status if the renewal date as passed already
    if (this.renewalDate < new Date()) {
        this.status = "EXPIRED";
    }

    // proceed with creation of document
    next();
});

// Making the model out of schema and exporting it
const SubscriptionModel = mongoose.Model("Subscription", subscriptionSchema);
export default SubscriptionModel;
