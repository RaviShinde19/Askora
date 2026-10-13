import { Router } from "express"
import {
    registerUser,
    loginUser,
    logoutUser
} from "../controllers/user.controller.js"
import { upload } from "../middlewares/upload.middleware.js"
import { verifyJWT } from "../middlewares/auth.middlewares.js"
// import multer from 'multer';
// const upload = multer();


const router = Router()

//Register and Login Routes
router.route("/register").post(
    upload.single("profilePic"),registerUser
);
router.route("/login").post(loginUser)

//Secured Routes
router.route("/logout").post(verifyJWT, logoutUser)

export default router 
