"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePassword = exports.logout = exports.getProfile = exports.login = exports.register = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const bcrypt_util_1 = require("../utils/bcrypt.util");
const apperror_utils_1 = __importDefault(require("../utils/apperror.utils"));
const bcrypt_util_2 = require("../utils/bcrypt.util");
const sendResponse_utils_1 = require("../utils/sendResponse.utils");
const catch_Async_utils_1 = require("../utils/catch.Async.utils");
const cloudinary_util_1 = require("../utils/cloudinary.util");
const jwt_utils_1 = require("../utils/jwt.utils");
const env_config_1 = require("../config/env.config");
const sendEmai_utils_1 = require("../utils/sendEmai.utils");
const emailTemplate_utils_1 = require("../utils/emailTemplate.utils");
//* register
exports.register = (0, catch_Async_utils_1.catchAsync)(async (req, res, next) => {
    const file = req.file;
    console.log(file);
    const { full_name, email, password } = req.body;
    const user = new user_model_1.default({ full_name, email });
    //* password hash
    const hash = await (0, bcrypt_util_1.hashPassword)(password);
    user.password = hash;
    //* upload profile image
    if (file) {
        const { path, public_id } = await (0, cloudinary_util_1.uploadFileToCloudinary)(file, "/profile_images");
        user.profile_image = {
            path,
            public_id,
        };
    }
    // * save user
    await user.save();
    //* send account created email
    (0, sendEmai_utils_1.sendEmail)({
        to: user.email,
        subject: "Account created",
        html: (0, emailTemplate_utils_1.generateAccountCreatedHtml)({
            full_name: user.full_name,
            email: user.email,
            createdAt: new Date(Date.now()),
        }),
    });
    //* converting mongodb doc to js object
    const { password: user_pass, ...rest } = user.toObject();
    //* send success response
    res.status(201).json({
        message: "Account created",
        status: "success",
        success: true,
        data: rest,
    });
});
//* login
exports.login = (0, catch_Async_utils_1.catchAsync)(async (req, res, next) => {
    const { email, password } = req.body;
    const user = await user_model_1.default.findOne({ email }).select("+password");
    if (!user) {
        throw new apperror_utils_1.default("invalid credentials", 400);
    }
    //* compare password
    const isPassMatched = await (0, bcrypt_util_2.comparePassword)(password, user.password);
    if (!isPassMatched) {
        throw new apperror_utils_1.default("invalid credentials", 400);
    }
    //* todo: generate jwt token
    const access_token = (0, jwt_utils_1.generateJwtToken)({
        _id: user._id,
        email: user.email,
        role: user.role,
    });
    //* convert user doc to object
    const { password: _, ...rest } = user.toObject();
    //* set-cookie header ->
    res.cookie("access_token", access_token, {
        maxAge: Number(env_config_1.ENV_CONFIG.COOKIE_EXPIRY ?? "7") * 24 * 60 * 60 * 1000, //converting milisecond
        httpOnly: env_config_1.ENV_CONFIG.NODE_ENV === " development" ? false : true,
    });
    //* send login dectected email
    (0, sendEmai_utils_1.sendEmail)({
        to: user.email,
        subject: "New Login Detected",
        html: (0, emailTemplate_utils_1.generateLoginSuccessHtml)({
            full_name: user.full_name,
            email: user.email,
            loginAt: new Date(Date.now()),
            userAgent: req.headers["user-agent"],
        }),
    });
    //*success response
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: "login successful",
        data: {
            user: rest,
            access_token,
        },
        statusCode: 201,
    });
});
//* get profile
exports.getProfile = (0, catch_Async_utils_1.catchAsync)(async (req, res) => {
    const id = req.user._id;
    const user = await user_model_1.default.findById(id);
    if (!user)
        throw new apperror_utils_1.default("user not found", 404);
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: "profile fetched",
        data: user,
        statusCode: 200,
    });
});
//*  logout
exports.logout = (0, catch_Async_utils_1.catchAsync)(async (_, res) => {
    res.clearCookie("access_token", {
        httpOnly: env_config_1.ENV_CONFIG.NODE_ENV === "development" ? false : true,
        secure: env_config_1.ENV_CONFIG.NODE_ENV === "development" ? false : true,
        sameSite: env_config_1.ENV_CONFIG.NODE_ENV === "development" ? "lax" : "none"
    });
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: "Logout success",
        statusCode: 200,
        data: null,
    });
});
//* change password
exports.changePassword = (0, catch_Async_utils_1.catchAsync)(async (req, res) => {
    const { old_password, new_password } = req.body;
    if (!old_password)
        throw new apperror_utils_1.default("old password id required", 400);
    if (!new_password)
        throw new apperror_utils_1.default("new  password is required", 400);
    const user = await user_model_1.default.findById(req.user._id).select("+password");
    if (!user)
        throw new apperror_utils_1.default("user not found", 404);
    const isPasswordMatched = await (0, bcrypt_util_2.comparePassword)(old_password, user.password);
    if (!isPasswordMatched) {
        throw new apperror_utils_1.default("old password is incorrect", 400);
    }
    user.password = await (0, bcrypt_util_1.hashPassword)(new_password);
    await user.save();
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: "Password change successfully",
        statusCode: 200,
        data: null,
    });
});
