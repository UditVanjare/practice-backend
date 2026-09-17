import { Router } from "express";
import { loginUser, logoutUser, refreshAccessToken, registerUser,updateUserCoverImage,updateUserAvatar,updateAccount,getCurrentUser,changeCurrentPassword } from "../controllers/user.controller.js";
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

router.route("/changeCurrentPassword").post(verifyJWT,changeCurrentPassword)
router.route("/getCurrentUser").post(verifyJWT,getCurrentUser)
router.route("/updateAccount").post(verifyJWT,updateAccount)
router.route("/updateUserAvatar").post(verifyJWT,upload.single("avatar"),updateUserAvatar)
router.route("/updateUserCoverImage").post(verifyJWT,upload.single("coverImage"),updateUserCoverImage)


export default router 