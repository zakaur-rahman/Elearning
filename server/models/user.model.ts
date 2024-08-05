require("dotenv").config()
import mongoose, { Model, Schema } from "mongoose";
import bcrypt from "bcryptjs";
import jwt, { Secret } from "jsonwebtoken";



const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface IUser extends Document {
    _id:string;
    isModified: any;
    name: string;
    email: string;
    password: string;
    avatar: {
        public_id: string;
        url: string;
    };
    role: string;
    isVerified: boolean;
    courses: Array<{ courseId: string }>;
    comparePassword: (password: string) => Promise<boolean>;
    SignAccessToken: () => string;
    SignRefreshToken: () => string;
}

const userSchema: Schema<IUser> = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name field cannot be empty"],
        },
        email: {
            type: String,
            require: [true, "Please enter your email"],
            validate: {
                validator: (value: string) => {
                    return emailPattern.test(value);
                },
                message: "Please enter a valid email",
            },
            unique: true,
        },
        password: {
            type: String,
            //required: [true, "Please enter your password"],
            minlength: [6, "Password must be at least 6 characters"],
            select: false,
        },
        avatar: {
            public_id: String,
            url: String,
        },
        role: {
            type: String,
            default: "user",
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        courses: [
            {
                courseId: String,
            },
        ],
    },
    { timestamps: true }
);

//Hash password before saving
userSchema.pre<IUser>("save", async function (next) {
    if(!this.isModified("password")){
        next();
    }
    this.password = await bcrypt.hash(this.password, 10);
    next();
});


//Sign Access token
userSchema.methods.SignAccessToken = function () {
    return jwt.sign({id:this._id}, process.env.ACCESS_SECRET_KEY || '',{expiresIn:"5m"})
}


//Sign Refresh token
userSchema.methods.SignRefreshToken = function () {
    return jwt.sign({id:this._id}, process.env.REFRESH_SECRET_KEY || '',{expiresIn:"3d"})
}
userSchema.methods.comparePassword = async function (
    enteredPassword: string
): Promise<boolean> {
    return await bcrypt.compare(enteredPassword, this.password);
};

const userModel: Model<IUser> = mongoose.model("User", userSchema) 
export default userModel