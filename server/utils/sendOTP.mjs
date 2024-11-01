const sendOTPEmail = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Email not found! Please register first."
            });
        }

        // Generate 6 digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000);

        // Store OTP in user document temporarily
        user.resetPasswordOtp = otp;
        user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
        await user.save();

        // Send email with OTP
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
            text: `Your OTP for password reset is: ${otp}\nThis OTP will expire in 10 minutes.`
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({
            success: true,
            message: "OTP sent successfully to your email!"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

export {
    sendOTPEmail
}