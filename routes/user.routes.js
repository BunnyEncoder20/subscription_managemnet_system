import { Router } from "express";
import {
    getAllUsers,
    getUserById,
    updateSpecificUser,
    deleteUserById,
} from "../controllers/user.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

// endpoint's prefix: api/v1/users
const userRouter = Router();

userRouter.get("/", authMiddleware, getAllUsers);
userRouter.get("/:id", authMiddleware, getUserById); // need authorization route

// TODO: Complete this route's controller
userRouter.put("/:id", authMiddleware, updateSpecificUser);

// TODO: Complete this route's controller
userRouter.delete("/:id", authMiddleware, deleteUserById);
p;

export default userRouter;
