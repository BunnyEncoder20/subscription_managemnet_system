import { Router } from "express";
import {
    getAllUsers,
    getUserById,
    updateSpecificUser,
    deleteUserById,
} from "../controllers/user.controller.js";
import authMiddleware, { verifyAdmin } from "../middlewares/auth.middleware.js";

// endpoint's prefix: api/v1/users
const userRouter = Router();

userRouter.get("/", authMiddleware, verifyAdmin, getAllUsers);
userRouter.get("/:id", authMiddleware, verifyAdmin, getUserById);
userRouter.put("/:id", authMiddleware, updateSpecificUser);
userRouter.delete("/:id", authMiddleware, deleteUserById);

export default userRouter;
