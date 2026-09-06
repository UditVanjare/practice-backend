import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from '../models/user.model.js'
import { uplodeOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/apiResponse.js";

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
   console.log(fullName , email,username,password)

// validation - not empty
   if([fullName , email,username,password].some((field) => field?.trim() ==="")
   ){
        throw new ApiError(400, "All field are required")
    }

// check if user already exists:(username or email)
    const existsedUser = User.findOne({
        $or : [{ username }, { email }]
     })
    if (existsedUser) {
        throw new ApiError(409,"User already exists ")
    }

// check for images,check for avatar in local storage
    const avatarLocalPath =  req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path; 
    if (!avatarLocalPath) {
        throw new ApiError(400,"Avatar file is  required ")
    }

// uplode them to cloudinary (check for avatar saved or not in cloudinary)
    const avatar = await uplodeOnCloudinary(avatarLocalPath)
    const coverImage = await uplodeOnCloudinary(coverImageLocalPath)
    if (!avatar) {
        throw new ApiError(400,"Avatar file is  required ")
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
    })

// return response
    return res.status(201).json(
        new ApiResponse(200,createdUser,"User registered successfully")
    )

export {registerUser}