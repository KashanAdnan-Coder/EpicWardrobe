import express from "express"
import { registerAccount } from "../controller/user.controller.mjs"
const router = express.Router()
import upload from "../utils/multer.mjs"

router.post("/register", upload.single("image"), registerAccount)

export default router