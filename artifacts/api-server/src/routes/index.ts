import { Router, type IRouter } from "express";
import healthRouter        from "./health";
import solveQuestionRouter from "./solveQuestion";
import adminRouter         from "./admin";
import profileRouter       from "./profile";

const router: IRouter = Router();

router.use(healthRouter);
router.use(solveQuestionRouter);
router.use(adminRouter);
router.use(profileRouter);

export default router;
