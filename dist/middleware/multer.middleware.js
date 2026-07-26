"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.multerUploader = void 0;
const multer_1 = __importDefault(require("multer"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const apperror_utils_1 = __importDefault(require("../utils/apperror.utils"));
const multerUploader = () => {
    const folder = "uploads";
    const fileSize = 5 * 1024 * 1024; //* 5MB in bytes
    const allowedExt = [".jpg", ".jpeg", ".web", ".svg"];
    const allowedMimeTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/svg+xml",
    ];
    if (!fs_1.default.existsSync(folder)) {
        fs_1.default.mkdirSync(folder, { recursive: true });
    }
    //! multer disk storage
    const myStorage = multer_1.default.diskStorage({
        destination: (_, __, cb) => {
            cb(null, folder);
        },
        filename: (_, file, cb) => {
            //* unique file name   ->  1.png   => 1784191270391-1.jpg
            const fileName = Date.now() + "-" + file.originalname;
            cb(null, fileName);
        },
    });
    //* file filter function
    const fileFilter = (_, file, cb) => {
        if (!allowedExt.includes(path_1.default.extname(file.originalname).toLowerCase())) {
            cb(new apperror_utils_1.default(`${file.originalname} is not accepted.Only ${allowedExt.join(",")} extensions are allowed}`, 400));
        }
        //* check file mime type
        if (!allowedMimeTypes.includes(file.mimetype)) {
            cb(new apperror_utils_1.default(`${file.originalname} is not accepted.Only ${allowedMimeTypes.join(",")} file types are allowed`, 400));
        }
        //* ccept file
        cb(null, true);
    };
    //! multer upload instance
    const upload = (0, multer_1.default)({
        storage: myStorage,
        fileFilter: fileFilter,
        limits: { fileSize: fileSize },
    });
    return upload;
};
exports.multerUploader = multerUploader;
