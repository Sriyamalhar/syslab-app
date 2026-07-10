import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth.js";
import projectsRouter from "./projects.js";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/auth", authRouter);
router.use("/projects", projectsRouter);

export default router;
