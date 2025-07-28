import { Router } from "express";
import { getAllUsers, getUserById } from "../controllers/user.controller.js";
import { authorize } from "../middlewares/auth.middleware.js";

// endpoint's prefix: api/v1/users
const userRouter = Router();

userRouter.get("/", authorize, getAllUsers);
userRouter.get("/:id", authorize, getUserById); // need authorization route

userRouter.put("/:id", (req, res) => {
    res.send({ message: "UPDATE specific user " });
});
userRouter.delete("/:id", (req, res) => {
    res.send({ message: "DELETE specific user" });
});

export default userRouter;
