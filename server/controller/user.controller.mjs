import userModel from "../models/user.model.mjs"
import { v2 as cloudinary } from 'cloudinary';
import bcryptjs from "bcryptjs"
import jwt from "jsonwebtoken"

import nodemailer from "nodemailer"

const registerAccount = async (req, res) => {
    try {
        const { name, email, password, mobile, isVendor, role } = req.body
        const emailExists = await userModel.findOne({ email })
        if (!emailExists) {
            cloudinary.uploader.upload(req.file.path, async function (err, result) {
                if (err) {
                    return res.json({
                        message: "Error",
                        success: false
                    }).status(500)
                }
                if (name === "" || email === "" || password === "" || mobile === "" || role === "") {
                    return res.status(400).json({
                        success: false,
                        message: "Please fill all the fields!"
                    })
                }
                if (password.length < 6) {
                    return res.status(400).json({
                        success: false,
                        message: "Password must be at least 6 characters!"
                    })
                }
                if (!email.includes("@")) {
                    return res.status(400).json({
                        success: false,
                        message: "Please enter a valid email!"
                    })
                }
                const mobileExist = await userModel.findOne({ mobile })
                if (mobileExist) {
                    return res.status(400).json({
                        success: false,
                        message: "Mobile number already exists!"
                    })
                }
                if (mobile.length !== 10) {
                    return res.status(400).json({
                        success: false,
                        message: "Please enter a valid mobile number!"
                    })
                }
                if (role !== "user" && role !== "seller" && role !== "job seeker") {
                    return res.status(400).json({
                        success: false,
                        message: "Please enter a valid role!"
                    })
                }
                const bcryptPassword = await bcryptjs.hash(password, 10)
                const user = await userModel.create({
                    name,
                    email,
                    password: bcryptPassword,
                    mobile,
                    profileImage: result.url,
                    isVendor,
                    role
                })
                // Send verification email
                const transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: process.env.EMAIL_USER,
                        pass: process.env.EMAIL_PASS
                    }
                });

                const mailOptions = {
                    from: process.env.EMAIL_USER,
                    to: email,
                    subject: 'Account Verification - Welcome to Our Platform',
                    html: `
                        <h1>Welcome ${name}!</h1>
                        <p>Thank you for registering with us. Your account has been created successfully.</p>
                        <p>To verify your account, please click on the link below:</p>
                        <a href="${process.env.BASE_URL}/users/verify/${user._id}">Click here to verify your account</a>
                        <p>Here are your account details:</p>
                        <ul>
                            <li>Name: ${name}</li>
                            <li>Email: ${email}</li>
                            <li>Role: ${role}</li>
                        </ul>
                        <p>Please verify your account before logging in.</p>
                        <p>Best regards,<br>Your Platform Team</p>
                    `
                };
                await transporter.sendMail(mailOptions);
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

const verifyAccount = async (req, res) => {
    try {
        const user = await userModel.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        if (user.isVerified) {
            return res.status(400).json({
                success: false,
                message: "Account is already verified"
            });
        }

        user.isVerified = true;
        await user.save();

        res.status(200).json({
            success: true,
            message: "Account verified successfully"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

const loginAccount = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await userModel.findOne({ email })
        if (!user.isVerified) {
            return res.status(401).json({
                success: false,
                message: "Please verify your account first. Check your email for verification link."
            })
        }

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Email not found! Please register first."
            })
        }

        const isPasswordValid = await bcryptjs.compare(password, user.password)

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid password!"
            })
        }
        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );
        res.cookie('token', token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000 // 24 hours
        }).status(200).json({
            success: true,
            message: "Login successful!",
            user
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const getAllUsers = async (req, res) => {
    try {
        const users = await userModel.find({}, { password: 0 }) // Exclude password field
        res.status(200).json({
            success: true,
            users
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const getUserById = async (req, res) => {
    try {
        const { id } = req.params
        const user = await userModel.findById(id, { password: 0 })

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found!"
            })
        }

        res.status(200).json({
            success: true,
            user
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const updateUser = async (req, res) => {
    try {
        const { id } = req.params
        const updates = req.body

        // Prevent password update through this route
        delete updates.password

        const user = await userModel.findByIdAndUpdate(
            id,
            updates,
            { new: true, runValidators: true }
        )

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found!"
            })
        }

        res.status(200).json({
            success: true,
            message: "User updated successfully!",
            user
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params
        const user = await userModel.findByIdAndDelete(id)

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found!"
            })
        }

        res.status(200).json({
            success: true,
            message: "User deleted successfully!"
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const changePassword = async (req, res) => {
    try {
        const { id } = req.params
        const { currentPassword, newPassword } = req.body

        const user = await userModel.findById(id)
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found!"
            })
        }

        const isPasswordValid = await bcryptjs.compare(currentPassword, user.password)
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Current password is incorrect!"
            })
        }

        const hashedPassword = await bcryptjs.hash(newPassword, 10)
        user.password = hashedPassword
        await user.save()

        res.status(200).json({
            success: true,
            message: "Password changed successfully!"
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const sendForgetPasswordOTP = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found!"
            });
        }

        // Generate 6 digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Set OTP and expiry (15 minutes)
        user.resetPasswordOtp = otp;
        user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;
        await user.save();

        // Send OTP via email
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Password Reset OTP',
            html: `
                <h1>Password Reset Request</h1>
                <p>Hello ${user.name},</p>
                <p>You have requested to reset your password. Please use the following OTP to proceed:</p>
                <h2>${otp}</h2>
                <p>This OTP will expire in 15 minutes.</p>
                <p>If you didn't request this, please ignore this email.</p>
                <p>Best regards,<br>Your Platform Team</p>
            `
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({
            success: true,
            message: "OTP sent successfully! Please check your email."
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

const forgetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;

        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found!"
            });
        }

        // Verify OTP
        if (!user.resetPasswordOtp || !user.resetPasswordExpires) {
            return res.status(400).json({
                success: false,
                message: "Please request OTP first!"
            });
        }

        if (user.resetPasswordOtp !== otp) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP!"
            });
        }

        if (Date.now() > user.resetPasswordExpires) {
            return res.status(400).json({
                success: false,
                message: "OTP has expired! Please request a new one."
            });
        }

        // Update password
        const hashedPassword = await bcryptjs.hash(newPassword, 10);
        user.password = hashedPassword;

        // Clear OTP fields
        user.resetPasswordOtp = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();

        res.status(200).json({
            success: true,
            message: "Password reset successfully!"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

export {
    registerAccount,
    loginAccount,
    getAllUsers,
    getUserById,
    sendForgetPasswordOTP,
    updateUser,
    deleteUser,
    changePassword,
    forgetPassword,
    verifyAccount
}