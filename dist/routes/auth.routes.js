"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("../controllers/auth.controller");
const validator_middleware_1 = require("../middleware/validator.middleware");
const auth_validators_1 = require("../validators/auth.validators");
const multer_middleware_1 = require("../middleware/multer.middleware");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = express_1.default.Router();
const upload = (0, multer_middleware_1.multerUploader)();
//* register account
router.post("/register", upload.single("profile_image"), (0, validator_middleware_1.validator)(auth_validators_1.registerUserSchema), auth_controller_1.register);
router.post("/login", (0, validator_middleware_1.validator)(auth_validators_1.loginSchema), auth_controller_1.login);
router.post("/logout", auth_controller_1.logout);
router.post("/register", (0, validator_middleware_1.validator)(auth_validators_1.registerUserSchema), auth_controller_1.register);
router.get("/profile", (0, auth_middleware_1.authenticate)(), auth_controller_1.getProfile);
router.put("/change-password", (0, auth_middleware_1.authenticate)(), auth_controller_1.changePassword);
exports.default = router;
