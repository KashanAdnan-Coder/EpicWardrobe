import mongoose from 'mongoose'

var userSchema = new mongoose.Schema({
    profileImage: {
        type: String,
        default: 'default-profile.png'
    },
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        minLength: [2, 'Name must be at least 2 characters']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
    },
    mobile: {
        type: String,
        required: [true, 'Mobile number is required'],
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minLength: [6, 'Password must be at least 6 characters']
    },
    role: {
        type: String,
        enum: ['user', "seller", "job seeker", 'admin'],
        default: 'user'
    },
    isVendor: {
        type: Boolean,
        default: false
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

const userModel = mongoose.model('User', userSchema);

export default userModel 