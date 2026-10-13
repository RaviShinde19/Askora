import { Router } from "express"
import {
    createQuestion,
    getAllQuestions,
    getQuestion,
    getQuestions
} from "../controllers/question.controller.js"
import { verifyJWT } from "../middlewares/auth.middlewares.js"


const router = Router()

router.route("/createQuestion").post(verifyJWT,createQuestion);
router.route("/getQuestions").get(getAllQuestions);
router.route("/:questionId").get(getQuestion);
router.route("/").get(getQuestions).post(verifyJWT,createQuestion);

export default router 