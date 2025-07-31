import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "is required field"],
            trim: true,
            minLength: 2,
            maxLength: 50,
        },
        email: {
            type: String,
            required: [true, "is required field"],
            unique: true,
            trim: true,
            lowercase: true,
            minLength: 2,
            maxLength: 50,
            match: [
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // regex for matching email pattern
                "Please enter a valid email address",
            ],
        },
        password: {
            type: String,
            required: [true, "is required field"],
            minLength: 8,
            select: false, // don't send the password back when querying for documents
        },
    },
    {
        timestamps: true,
    },
);

//  Make the mode
const UserModel = mongoose.model("User", userSchema);
export default UserModel;

// Example json:
// {
//     "_id": "64b5c0f0e4b9c9b0f0e4b9c9",
//     "name": "John Doe",
//     "email": "john.doe@example.com",
//     "password": "$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi",
//     "createdAt": "2023-07-01T12:00:00.000Z",
//     "updatedAt": "2023-07-01T12:00:00.000Z"
// }
