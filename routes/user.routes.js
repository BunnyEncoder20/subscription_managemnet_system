import { Router } from "express";
import { getAllUsers, getUserById } from "../controllers/user.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

// endpoint's prefix: api/v1/users
const userRouter = Router();

userRouter.get("/", authMiddleware, getAllUsers);
userRouter.get("/:id", authMiddleware, getUserById); // need authorization route

// TODO: Complete this route's controller
userRouter.put("/:id", (req, res) => {
    res.send({ message: "UPDATE specific user " });
});

// TODO: Complete this route's controller
userRouter.delete("/:id", (req, res) => {
    res.send({ message: "DELETE specific user" });
});

export default userRouter;
