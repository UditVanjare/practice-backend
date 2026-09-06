import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";
import { uplode } from "../middlewares/multer.middlewares.js"

const router = Router()

router.route("/register").post(
    
        // middleware to store file in multer storage
        uplode.fields([
            {
                name : "avatar",
                maxCount : 1
            },{
                name : "coverImage",
                maxCount :  1
            }
        ]),
    // calling register controller 
    registerUser
)




export default router 