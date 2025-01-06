import { Router } from "express";
import { changePassword, getMe, updateMe } from "controllers/user.controller";
import authenticate from "utils/authenticate";
import multer from "multer";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/users");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = uuidv4();
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext);
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error("Недопустимый тип файла. Допустимы только JPEG, PNG и GIF.")
      );
    }
  },
});

const userRouter = Router();

userRouter.get("/me", authenticate, getMe);
userRouter.put("/", authenticate, upload.single("avatar"), updateMe);
userRouter.post("/change-password", authenticate, changePassword);

export default userRouter;
