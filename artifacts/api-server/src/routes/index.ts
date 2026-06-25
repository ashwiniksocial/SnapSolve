import { Router, type IRouter } from "express";
import healthRouter        from "./health";
import solveQuestionRouter from "./solveQuestion";
import adminRouter         from "./admin";
import profileRouter       from "./profile";
import teacherReviewRouter from "./teacherReview";
import tutorRouter         from "./tutor";

const router: IRouter = Router();

router.use(healthRouter);
router.use(solveQuestionRouter);
router.use(adminRouter);
router.use(profileRouter);
router.use(teacherReviewRouter);
router.use(tutorRouter);

export default router;
