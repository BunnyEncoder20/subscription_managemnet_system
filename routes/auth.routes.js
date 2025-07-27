import { Router } from "express";

// endpoints prefix: /api/v1/auth
const authRouter = Router();

authRouter.post("/sign-up", (req, res) => {
    res.send({
        msg: "Sign Up",
    });
});

authRouter.post("/sign-in", (req, res) => {
    res.send({
        msg: "Sign In",
    });
});

authRouter.post("/sign-out", (req, res) => {
    res.send({
        msg: "Sign Out",
    });
});

export default authRouter;
