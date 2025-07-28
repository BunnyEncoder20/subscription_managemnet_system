import UserModel from "../models/users.model.js";

export const getAllUsers = async (req, res, next) => {
    console.log("[server] fetching all users...");
    try {
        const users = await UserModel.find();

        console.log("[sevrer] done");
        res.status(200).json({
            success: true,
            data: users,
        });
    } catch (error) {
        next(error);
    }
};

export const getUserById = async (req, res, next) => {
    console.log(`[sever] fetching user:${req.params.id}`);
    try {
        // fetch the user by id (get all feilds - password cause we don't want to return that)
        const user = await UserModel.findById(req.params.id).select(
            "-password",
        );

        if (!user) {
            const error = new Error("user not found");
            error.statusCode = 404;
            throw error;
        }

        console.log("[server] done");
        res.status(200).json({
            success: true,
            data: user,
        });
    } catch (error) {
        next(error);
    }
};
