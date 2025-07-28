import { Router } from "express";

// importing the controllers
import { signUp, signIn, signOut } from "../controllers/auth.controller.js";

// endpoints prefix: /api/v1/auth
const authRouter = Router();

authRouter.post("/sign-up", signUp);
authRouter.post("/sign-in", signIn);
authRouter.post("/sign-out", signOut);

export default authRouter;
