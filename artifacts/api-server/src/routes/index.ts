import { Router, type IRouter } from "express";
import healthRouter       from "./health";
import solveQuestionRouter from "./solveQuestion";

const router: IRouter = Router();

router.use(healthRouter);
router.use(solveQuestionRouter);

export default router;
