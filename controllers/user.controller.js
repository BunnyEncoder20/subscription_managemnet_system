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

export const updateSpecificUser = async (req, res, next) => {
    console.log(`[server] req to update user:${req.params.id} data`);

    try {
        if (req.params.id === req.user._id || req.user.isAdmin) {
            console.log(`[server] finding user and updating data...`);
            const updatedUser = await UserModel.findByIdAndUpdate(
                req.user._id,
                req.body,
                {
                    new: true, // return updated document
                    runValidators: true, // run validators on updated data
                },
            );
            console.log("[server] done");
            res.status(200).json({
                success: true,
                data: updatedUser,
            });
        } else {
            const error = new Error(
                `user:${req.user.email} is not authorized to update user:${req.params.id}`,
            );
            error.statusCode = 403;
            throw error;
        }
    } catch (error) {
        console.log(
            `[server] there was a error updating user:${req.params.id} data`,
        );
        next(error);
    }
};

export const deleteUserById = async (req, res, next) => {
    console.log(`[server] req to delete user:${req.params.id}`);

    try {
        if (req.params.id == req.user._id || req.user.isAdmin) {
        } else {
            const error = new Error(
                `user:${req.user.email} is not authorized to delete user:${req.params.id}`,
            );
            error.statusCode = 403;
            throw error;
        }
    } catch (error) {
        console.log(
            `[server] there was a error deleting user:${req.params.id}`,
        );
        next(error);
    }
};
