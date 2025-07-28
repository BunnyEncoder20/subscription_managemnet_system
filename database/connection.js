import mongoose from "mongoose";
import { DB_URI, NODE_ENV } from "../config/env.js";

if (!DB_URI) {
    throw new Error(
        "Please define the MongoDB connection URI env variable inside '.env<development/production>.local'",
    );
}

// connecting to Dat
const connect2database = async () => {
    try {
        await mongoose.connect(DB_URI);
        console.log(`[server] Connected to database in ${NODE_ENV} mode`);
    } catch (error) {
        console.error("[server] Error connecting to the database: ", error);
        process.exit(1);
    }
};

export default connect2database;
