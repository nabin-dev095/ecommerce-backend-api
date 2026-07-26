import express from "express";
import { changePassword, getProfile, login, logout, register } from "../controllers/auth.controller";
import { validator } from "../middleware/validator.middleware";
import { loginSchema, registerUserSchema } from "../validators/auth.validators";
import { multerUploader } from "../middleware/multer.middleware";
import { authenticate } from "../middleware/auth.middleware";



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
router.post("/logout", logout);
router.post("/register", validator(registerUserSchema), register);
router.get("/profile", authenticate(), getProfile);
router.put("/change-password", authenticate(), changePassword);
export default router;
