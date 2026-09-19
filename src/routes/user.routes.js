import { Router } from "express";
import { loginUser,
         logoutUser,
         refreshAccessToken,
         registerUser,
         updateUserCoverImage,
         updateUserAvatar,
         updateAccount,
         getCurrentUser,
         changeCurrentPassword,
         getUserChannelProfile,
         getWatchHistory,
        } from "../controllers/user.controller.js";
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
router.route("/refresh-token").post(refreshAccessToken)

router.route("/change-current-password").post(verifyJWT,changeCurrentPassword)
router.route("/get-current-user").get(verifyJWT,getCurrentUser)
router.route("/update-account").patch(verifyJWT,updateAccount)
router.route("/update-user-avatar").patch(verifyJWT,upload.single("avatar"),updateUserAvatar)
router.route("/update-user-cover-image").patch(verifyJWT,upload.single("coverImage"),updateUserCoverImage)
router.route("/c/:username").get(verifyJWT,getUserChannelProfile)
router.route("/history").get(verifyJWT,getWatchHistory)

export default router 