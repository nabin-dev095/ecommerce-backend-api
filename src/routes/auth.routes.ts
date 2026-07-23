import express from "express";
import { login, register } from "../controllers/auth.controller";
import { validator } from "../middleware/validator.middleware";
import { loginSchema, registerUserSchema } from "../validators/auth.validators";
import { multerUploader } from "../middleware/multer.middleware";



const router = express.Router();
const upload = multerUploader();



//* register account
router.post(
    "/register",
    upload.single("profile_image"),
    validator(registerUserSchema),
    register,
)


router.post("/login", validator(loginSchema), login)
router.post("/register", validator(registerUserSchema), register);
export default router;
