import { Router } from "express";

// endpoint's prefix: api/v1/users
const userRouter = Router();

userRouter.get("/", (req, res) => {
    res.send({ message: "GET all users" });
});

userRouter.get("/:id", (req, res) => {
    res.send({ message: "GET specific users" });
});

userRouter.post(" /", (req, res) => {
    res.send({ message: "CREATE new user" });
});

userRouter.put("/:id", (req, res) => {
    res.send({ message: "UPDATE specific user " });
});
userRouter.delete("/:id", (req, res) => {
    res.send({ message: "DELETE specific user" });
});

export default userRouter;
