import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from '../models/user.model.js'
import { uplodeOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js"
import jwt from "jsonwebtoken"


const generateAccessAndRefreshTokens = async(userId) =>
    { 
        try {
            const user = await User.findOne(userId)
            const accessToken = user.generateAccessToken()
            const refreshToken = user.generateRefreshToken()

            user.refreshToken = refreshToken
            await user.save({ validateBeforeSave: false })

            return {accessToken , refreshToken}

        } catch (error) {
            throw new ApiError(500,"something went wrong while genrerating refresh and access token ")
        }
}

const registerUser = asyncHandler( async (req , res)=> {
   // get user details from fronted
   // validation - not empty
   // check if user already exists:(username or email)
   // check for images,check for avatar in local storage
   // uplode them to cloudinary (check for avatar saved or not in cloudinary)
   // create user object - create entry in db 
   // remove passworld and refresh token feed from response
   // check for user creation 
   // return response

// get user details from fronted
   const {fullName , email,username,password}= req.body

// validation - not empty
   if([fullName , email,username,password].some((field) => field?.trim() ==="")
   ){
        throw new ApiError(400, "All field are required")
    }

// check if user already exists:(username or email)
    const existsedUser = await User.findOne({
        $or : [{ username }, { email }]
     })
    if (existsedUser) {
        throw new ApiError(409,"User already exists ")
    }

// Read image files from the multipart request.
    const avatarLocalPath = req.files?.avatar?.[0]?.path;
    // const coverImageLocalPath = req.files?.coverImage?.[0]?.path; 
    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path
    }

    if (!avatarLocalPath) {
        throw new ApiError(420, "Avatar file is required in multer")
    }

// Upload the required avatar and optional cover image.
    const avatar = await uplodeOnCloudinary(avatarLocalPath)
    const coverImage = await uplodeOnCloudinary(coverImageLocalPath)

    if (!avatar) {
        throw new ApiError(400, "Avatar file is required to uplode")
    }

// create user object - create entry in db
    const user = await  User.create({
        fullName,
        avatar : avatar.url,
        coverImage : coverImage?.url || "",
        email,
        password,
        username : username.toLowerCase()
    })

// remove passworld and refresh token feed from response
    const createdUser = await User.findById(user.id).select(
        "-password -refreshToken"
    )

// check for user creation 
    if (!createdUser) {
        throw new ApiError(500,"something went wrong when registering the user")
        }
        // return response
        return res.status(201).json(
            new ApiResponse(200,createdUser,"User registered successfully")
        )
    })

const loginUser = asyncHandler(async (req , res)=>{
    //get username/email  and password using req.body
    //check username or email  exists in db 
    //check the password is correct
    //access and refreshtoken generete and send to user
    // send tokens to cookies 
    // respones successfuly login 

    const {email , password,username} = req.body
    if (!username && !email) {
        throw new ApiError(400,"username or email is required  ")
    }

    const user = await User.findOne({
        $or : [{username},{email}]
    })

    if (!user) {
        throw new ApiError(404,"user does not exist")
    }

    if (!password) {
        throw new ApiError(400,"passworld  is required ")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)
    if (!isPasswordValid) {
        throw new ApiError(401,"passworld  is incorrect")
    }

    const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(user._id)

    const loggedInUser = await User.findById(user._id).
    select("-password -refreshToken ")

    const options = {
        httpOnly : true,
        secure : true ,
    }

    return res.status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(
        new ApiResponse(
            200,
            {
                user: loggedInUser,accessToken,refreshToken
            },
            "User logged in successfully  "
        )
    )
}) 

const logoutUser = asyncHandler(async (req,res)=>{
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set :{
                refreshToken : undefined
            },
        },{
            new : true
        }
    )
    const options = {
        httpOnly : true,
        secure : true ,
    }

    return res
    .status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(new ApiResponse(200,{},"user logged out"))
})

const refreshAccessToken = asyncHandler( async (req,res) => {
    const incomingRefreshToken = req.cookie.refreshToken || req.body.refreshToken

    if (incomingRefreshToken) {
        throw new ApiError("401","unauthrized request  ")
    }

    try {
        const decodedToken =  jwt.verify(incomingRefreshToken.process.env.refreshAccessToken)
    
        const user = await User.findById(decodedToken?._id)
    
        if (!user) {
            throw new ApiError("401","invalid refresh token  ")
        }
    
        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError("401","REFRESH TOKEN is expired or used")
        }
    
        const options = {
            httpOnly : true ,
            secure : true , 
        }
    
        const {accessToken ,newRefreshToken}= await generateAccessAndRefreshTokens(user._id)
    
        return res
            .status(200)
            .cookie("accessToken",accessToken,options)
            .cookie("refreshToken",newRefreshToken,options)
            .json(new ApiResponse(200,
                { accessToken ,refreshToken:newRefreshToken }),
                "Access Token refreshed")
    } catch (error) {
        throw new ApiError(401,error?.message || "invalid refresh token ")
    }
})

export { 
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken
}
