import express from "express"
import { registerAccount } from "../controller/user.controller.mjs"
const router = express.Router()

router.post("/register", registerAccount)

export default router