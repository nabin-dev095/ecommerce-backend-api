"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.remove = exports.update = exports.crate = exports.getById = exports.getAll = void 0;
const brand_model_1 = __importDefault(require("../models/brand.model"));
const sendResponse_utils_1 = require("../utils/sendResponse.utils");
const catch_Async_utils_1 = require("../utils/catch.Async.utils");
const apperror_utils_1 = __importDefault(require("../utils/apperror.utils"));
const cloudinary_util_1 = require("../utils/cloudinary.util");
//* get all
const getAll = async (req, res, next) => {
    try {
        const brands = await brand_model_1.default.find({});
        //* send success response
        (0, sendResponse_utils_1.sendResponse)(res, {
            data: brands,
            message: "brands fetched",
            statusCode: 200,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getAll = getAll;
//* get by id
exports.getById = (0, catch_Async_utils_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const brand = await brand_model_1.default.findOne({ _id: id });
    if (!brand)
        throw new apperror_utils_1.default("brand not found", 404);
    //* send success response
    (0, sendResponse_utils_1.sendResponse)(res, {
        data: brand,
        message: "brand fetched",
        statusCode: 200,
    });
});
//* create
exports.crate = (0, catch_Async_utils_1.catchAsync)(async (req, res) => {
    const { name, description } = req.body;
    const file = req.file;
    if (!file)
        throw new apperror_utils_1.default("cover_image is required", 400);
    const brand = new brand_model_1.default({ name, description });
    const { path, public_id } = await (0, cloudinary_util_1.uploadFileToCloudinary)(file, "/brands");
    brand.logo = {
        path,
        public_id,
    };
    await brand.save();
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: "brand created",
        data: brand,
        statusCode: 201,
    });
});
//* update
exports.update = (0, catch_Async_utils_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body;
    const file = req.file;
    const brand = await brand_model_1.default.findOne({ _id: id });
    if (!brand)
        throw new apperror_utils_1.default("brand not found", 404);
    if (name)
        brand.name = name;
    if (description)
        brand.description;
    if (file) {
        //! delete old logo
        (0, cloudinary_util_1.deleteFileFormCloudinary)(brand.logo.public_id);
        //* uploead new logo
        const { path, public_id } = await (0, cloudinary_util_1.uploadFileToCloudinary)(file, "/brands");
        brand.logo = {
            path,
            public_id,
        };
    }
    await brand.save();
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: "brand updated",
        data: brand,
        statusCode: 200,
    });
});
//* delete
exports.remove = (0, catch_Async_utils_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const brand = await brand_model_1.default.findOne({ _id: id });
    if (!brand)
        throw new apperror_utils_1.default("brand not found", 404);
    (0, cloudinary_util_1.deleteFileFormCloudinary)(brand.logo.public_id);
    await brand.deleteOne();
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: "brand updated",
        data: brand,
        statusCode: 200,
    });
});
