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
userRouter.get("/:id", authMiddleware, getUserById);
userRouter.put("/:id", authMiddleware, updateSpecificUser);
userRouter.delete("/:id", authMiddleware, deleteUserById);

export default userRouter;
