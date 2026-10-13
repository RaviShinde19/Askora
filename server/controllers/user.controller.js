import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import axios from 'axios';
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const generateAccessAndRefreshTokens = async(userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return {accessToken, refreshToken}

    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating referesh and access token")
    }
}

const registerUser = asyncHandler(async (req, res) => {
    const { firstname, lastname, username, email, password, phone } = req.body;
    console.log('Received data:', {
        ...req.body,
        isTermsAccepted: req.body.isTermsAccepted,
        file: req.file ? true : false
    });
    
    // Handle isTermsAccepted properly
    const isTermsAccepted = req.body.isTermsAccepted === "true" || req.body.isTermsAccepted === true;

    if (!firstname || !lastname || !username || !email || !password || !phone || !isTermsAccepted) {
        throw new ApiError(400, "All fields and terms acceptance are required");
    }

    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
    if (existingUser) throw new ApiError(409, "User already exists");

    let profilePicUrl = "";
    if (req.file) {
        const cloudinaryResult = await uploadOnCloudinary(req.file.path);
        if (!cloudinaryResult) throw new ApiError(500, "Image upload failed");
        profilePicUrl = cloudinaryResult.secure_url;
    }

    const newuser = await User.create({
        firstname,
        lastname,
        username,
        email,
        password,
        phone,
        profilePicUrl,
        isTermsAccepted,
    });

    const cleanUser = await User.findById(newuser._id).select("-password -refreshToken");

    res.status(201).json(new ApiResponse(201, cleanUser, "User registered"));
});

const loginUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) throw new ApiError(400, "Missing credentials");

  const user = await User.findOne({ username });
  if (!user) throw new ApiError(404, "User not found");

  const isValid = await user.isPasswordCorrect(password);
  if (!isValid) throw new ApiError(401, "Invalid password");

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);
  console.log(accessToken)
  console.log(refreshToken)
  const userData = await User.findById(user._id).select("-password -refreshToken");

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  };

  res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(new ApiResponse(200, {
      user: userData,
      // Optionally still return tokens if needed by frontend
      tokens: {
        accessToken,
        refreshToken
      }
    }, "Login successful"));
});

const logoutUser = asyncHandler(async(req,res)=>{
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1 // this removes the field from document
            }
        },
        {
            new: true
        }
    )

    const options = {
        // httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"))
})


export {
    registerUser,
    loginUser,
    logoutUser
}