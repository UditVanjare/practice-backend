import { Router } from "express";
import { loginUser, logoutUser, refreshAccessToken, registerUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middlewares.js"
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router()


router.route("/register").post(  
        // middleware to store file in multer storage
        upload.fields([
            {
                name : "avatar",
                maxCount: 1
            },{
                name : "coverImage",
                maxCount:  1
            }
        ]),
    // calling register controller 
    registerUser
)
router.route("/login").post(loginUser)


//secured routes
router.route("/logout").post(verifyJWT,logoutUser)
router.route("/refreshtoken").post(refreshAccessToken)


export default router 