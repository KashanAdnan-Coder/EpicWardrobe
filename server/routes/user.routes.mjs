import express from "express"
import { registerAccount, loginAccount, getAllUsers, getUserById, updateUser, deleteUser, changePassword, forgetPassword, verifyAccount, sendForgetPasswordOTP } from "../controller/user.controller.mjs"
const router = express.Router()
import upload from "../utils/multer.mjs"
import { adminAuth, auth } from "../middlewares/auth.mjs"


router.post("/register", upload.single("profileImage"), registerAccount)
router.post("/login", loginAccount)
router.get("/verify/:id", verifyAccount)
router.get("/", adminAuth, getAllUsers)
router.get("/:id", getUserById)
router.put("/:id", auth, updateUser)
router.delete("/:id", auth, deleteUser)
router.put("/:id/change-password", changePassword)
router.post("/forget-password/send-otp", sendForgetPasswordOTP)
router.post("/forget-password", forgetPassword)


export default router