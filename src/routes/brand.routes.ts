import  Express from  "express";

import { getAll, getById, remove, update } from "../controllers/brand.controller";
import { multerUploader } from "../middleware/multer.middleware";
import { create } from "node:domain";
import { authenticate } from "../middleware/auth.middleware";
import { Role } from "../types/enum.types";

const router = Express.Router();
const upload = multerUploader();

//* get all
router.get("/",  getAll);

//* get by id
router.get("/:id", getById);

//* create
router.post("/", authenticate([Role.ADMIN, Role.SUPER_ADMIN]),
 upload.single("logo"), create);

//* UPDATE 
 router.put("/:id", authenticate([Role.ADMIN, Role.SUPER_ADMIN]), upload.single("logo"), update)

 //* DELETE
 router.delete("/:id", authenticate([Role.ADMIN, Role.SUPER_ADMIN]), remove);

export default router;

