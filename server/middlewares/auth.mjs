import jwt from "jsonwebtoken"
import userModel from "../models/user.model.mjs"

const auth = async (req, res, next) => {
    try {
        const token = req.cookies.token

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "No authentication token found"
            })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await userModel.findOne({ _id: decoded.id })

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found"
            })
        }

        req.user = user
        next()
    } catch (error) {
        res.status(401).json({
            success: false,
            message: "Please authenticate"
        })
    }
}

const adminAuth = async (req, res, next) => {
    try {
        const token = req.cookies.token

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "No authentication token found"
            })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await userModel.findOne({ _id: decoded.id })

        if (!user || user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: "Access denied. Admin only."
            })
        }

        req.user = user
        next()
    } catch (error) {
        res.status(401).json({
            success: false,
            message: "Please authenticate"
        })
    }
}

const sellerAuth = async (req, res, next) => {
    try {
        const token = req.cookies.token

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "No authentication token found"
            })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await userModel.findOne({ _id: decoded.id })

        if (!user || user.role !== 'seller') {
            return res.status(403).json({
                success: false,
                message: "Access denied. Seller only."
            })
        }

        req.user = user
        next()
    } catch (error) {
        res.status(401).json({
            success: false,
            message: "Please authenticate"
        })
    }
}

const jobSeekerAuth = async (req, res, next) => {
    try {
        const token = req.cookies.token

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "No authentication token found"
            })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await userModel.findOne({ _id: decoded.id })

        if (!user || user.role !== 'job seeker') {
            return res.status(403).json({
                success: false,
                message: "Access denied. Job seeker only."
            })
        }

        req.user = user
        next()
    } catch (error) {
        res.status(401).json({
            success: false,
            message: "Please authenticate"
        })
    }
}

export { auth, adminAuth, sellerAuth, jobSeekerAuth }
