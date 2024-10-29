import mongoose from 'mongoose'

var userSchema = new mongoose.Schema({
    profileImage: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    mobile: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
});

const userModel = mongoose.model('user', userSchema);

export default userModel 