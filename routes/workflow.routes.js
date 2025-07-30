import { Router } from "express";

import { sendReminders } from "../controllers/workflow.controller.js";

// endpoint's prefix: api/v1/workflows
const workflowRouter = Router();

workflowRouter.post("/subscription/reminder", sendReminders);

export default workflowRouter;
