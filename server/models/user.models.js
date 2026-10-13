import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new Schema(
    {
        firstname: {
            type: String,
            required: true,
        },
        lastname: {
            type: String,
            required: true,
        },
        username:{
            type: String, 
            required: true, 
            unique: true
        },
        email:{ 
            type: String, 
            required: true, 
            unique: true
        },
        password: { 
            type: String, 
            required: [true,'Password is required'] 
        },
        phone: {
            type: String,
            required: true
        },
        profilePicUrl: {
            type: String
        },
        role: { 
            type: String, 
            enum: ["guest", "user", "admin"], 
            default: "user" 
        },
        isBanned: { 
            type: Boolean, 
            default: false 
        },
        refreshToken: {
            type: String
        },
        isTermsAccepted: {
            type: Boolean,
            required: true,
            default: false,
        },
        }, 
        { 
            timestamps: true 
        }
    )

userSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10)
    next()
})

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            userType: "user"
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            userType: "user"
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User",userSchema)
