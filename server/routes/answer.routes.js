import { Router } from "express"
import {
    createAnswer,
    getAnswers,
    acceptAnswer,
    voteAnswer
} from "../controllers/answer.controller.js"
import { verifyJWT } from "../middlewares/auth.middlewares.js"


const router = Router()

router.route("/createAnswer").post(verifyJWT,createAnswer);
router.route("/:questionId")
  .get(getAnswers);

router.route("/:answerId/vote")
  .post(verifyJWT, voteAnswer);

router.route("/:answerId/accept")
  .post(verifyJWT, acceptAnswer);

export default router 