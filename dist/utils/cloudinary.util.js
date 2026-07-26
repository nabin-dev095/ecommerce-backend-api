"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFileFormCloudinary = exports.uploadFileToCloudinary = void 0;
const cloudinary_config_1 = __importDefault(require("../config/cloudinary.config"));
const apperror_utils_1 = __importDefault(require("./apperror.utils"));
const fs_1 = __importDefault(require("fs"));
const uploadFileToCloudinary = async (file, dir = "/") => {
    try {
        const uploadFolder = "mernstack" + dir;
        const { secure_url: path, public_id } = await cloudinary_config_1.default.uploader.upload(file.path, {
            unnique_filename: true,
            folder: uploadFolder,
        });
        //* delete from local uploads folder
        if (fs_1.default.existsSync(file.path)) {
            fs_1.default.unlinkSync(file.path);
        }
        return { path, public_id };
    }
    catch (error) {
        console.log(error);
        throw new apperror_utils_1.default("Something went wrong", 500);
    }
};
exports.uploadFileToCloudinary = uploadFileToCloudinary;
//* delete file from cloudinary
const deleteFileFormCloudinary = async (public_id) => {
    try {
        await cloudinary_config_1.default.uploader.destroy(public_id);
        return true;
    }
    catch (error) {
        console.log(error);
        throw new apperror_utils_1.default("something went wrong", 500);
    }
};
exports.deleteFileFormCloudinary = deleteFileFormCloudinary;
