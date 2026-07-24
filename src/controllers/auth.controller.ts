import { NextFunction, Request, Response } from "express";
import User from "../models/user.model";
import { hashPassword } from "../utils/bcrypt.util";
import AppError from "../utils/apperror.utils";
import { comparePassword } from "../utils/bcrypt.util";
import { sendResponse } from "../utils/sendResponse.utils";
import { catchAsync } from "../utils/catch.Async.utils";
import { uploadFileToCloudinary } from "../utils/cloudinary.util";
import { generateJwtToken } from "../utils/jwt.utils";
import { ENV_CONFIG } from "../config/env.config";
import { sendEmail } from "../utils/sendEmai.utils";
import { generateAccountCreatedHtml, generateLoginSuccessHtml } from "../utils/emailTemplate.utils";

//* register
export const register = catchAsync(
   async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
   const file = req.file;
   console.log(file);
   
  
    const { full_name, email, password } = req.body;

    const user = new User({ full_name, email });

    //* password hash
    const hash = await hashPassword(password);
    user.password = hash;

    //* upload profile image
    if(file){
      const { path, public_id} = await uploadFileToCloudinary(
        file,
        "/profile_images",
      )

    user.profile_image = {
      path,
      public_id,
    }
  }

    // * save user
    await user.save();

    //* send account created email
    sendEmail({
      to: user.email,
      subject: "Account created",
      html: generateAccountCreatedHtml({
        full_name: user.full_name,
        email: user.email,
        createdAt: new Date(Date.now()),

      }),
    })

    //* converting mongodb doc to js object
    const { password: user_pass, ...rest } = user.toObject();

    //* send success response
    res.status(201).json({
      message: "Account created",
      status: "success",
      success: true,
      data: rest,
    });
 
}
);

//* login
export const login = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      throw new AppError("invalid credentials", 400);
    }

    //* compare password
    const isPassMatched = await comparePassword(password, user.password);
    if (!isPassMatched) {
      throw new AppError("invalid credentials", 400);
    }

    //* todo: generate jwt token
    const access_token = generateJwtToken({
      _id: user._id,
      email: user.email,
      role: user.role,
    });

    //* convert user doc to object
    const { password: _, ...rest } = user.toObject();

    //* set-cookie header ->
    res.cookie("access_token", access_token,{
      maxAge:Number(ENV_CONFIG.COOKIE_EXPIRY ?? "7") * 24 * 60 * 60 * 1000, //converting milisecond
      httpOnly: ENV_CONFIG.NODE_ENV === " development" ? false: true,
    });

    //* send login dectected email
    sendEmail({
      to: user.email,
      subject: "New Login Detected",
      html: generateLoginSuccessHtml({
        full_name: user.full_name,
        email: user.email,
        loginAt: new Date(Date.now()),
        userAgent: req.headers["user-agent"] as string,
      }),
    });


    //*success response
    sendResponse(res, {
      message: "login successful",
      data: {
        user: rest,
        access_token,
      },
      statusCode: 201,
    });
  },
);
