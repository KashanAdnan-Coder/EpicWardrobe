import mongoose from 'mongoose'

async function connectDatabase(URI) {
    try {
        await mongoose.connect(URI)
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } catch (err) {
        console.log(err);

    }
}

export default connectDatabase