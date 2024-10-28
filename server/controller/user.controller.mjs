import userModel from "../models/user.model.mjs"

const registerAccount = async (req, res) => {
    try {
        const { name, email, password, mobile, profileImage } = req.body
        const user = new userModel.create({
            name,
            email,
            password,
            mobile,
        })
        res.status(201).json({
            user,
            success: true,
            message: "Registration Completed Successfully!"
        })
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