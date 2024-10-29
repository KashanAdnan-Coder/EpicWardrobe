import userModel from "../models/user.model.mjs"
import { v2 as cloudinary } from 'cloudinary';
import bcryptjs from "bcryptjs"

const registerAccount = async (req, res) => {
    try {
        const { name, email, password, mobile } = req.body
        const emailExists = await userModel.findOne({ email })
        if (!emailExists) {
            cloudinary.uploader.upload(req.file.path, async function (err, result) {
                if (err) {
                    return res.json({
                        message: "Error",
                        success: false
                    }).status(500)
                }
                const bcryptPassword = await bcryptjs.hash(password, 10)
                const user = await userModel.create({
                    name,
                    email,
                    password: bcryptPassword,
                    mobile,
                    profileImage: result.url
                })
                res.status(201).json({
                    user,
                    success: true,
                    message: "Registration Completed Successfully!"
                })
            })
        } else {
            return res.status(400).json({
                success: false,
                message: "Email exists, please change the email!"
            })
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const loginAccount = async (req, res) => {
    try {
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export {
    registerAccount
}