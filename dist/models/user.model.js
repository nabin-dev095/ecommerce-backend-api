"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const image_model_1 = __importDefault(require("./image.model"));
var Role;
(function (Role) {
    Role["USER"] = "USER";
    Role["ADMIN"] = "ADMIN";
})(Role || (Role = {}));
//* schema
const userSchema = new mongoose_1.default.Schema({
    full_name: {
        type: String,
        required: [true, "full_name is required"],
        trim: true,
        minLength: [3, "name must be 3 characters long."],
    },
    email: {
        type: String,
        required: [true, "email is required"],
        trim: true,
        unique: [true, "user already exists with provided email"],
    },
    password: {
        type: String,
        required: [true, "password is required"],
        select: false,
    },
    role: {
        type: String,
        enum: Object.values(Role),
        default: Role.USER,
    },
    profile_image: {
        type: image_model_1.default,
        default: null,
    },
}, { timestamps: true });
//* model
const User = mongoose_1.default.model("user", userSchema);
exports.default = User;
