import express from "express"
import dotenv from "dotenv"
dotenv.config()
import { v2 as cloudinary } from 'cloudinary';
import connectDatabase from "./database/index.mjs"
import userRoute from "./routes/user.routes.mjs"

const app = express()
app.use(express.json())
app.use("/users", userRoute)
cloudinary.config({
    cloud_name: 'da3kbt3yk',
    api_key: process.env.api_key,
    api_secret: process.env.api_secret // Click 'View API Keys' above to copy your API secret
});
const PORT = process.env.PORT || 3000
connectDatabase(process.env.MONGODB_URI)

app.listen(PORT, () => {
    console.log(`Server is listening ${PORT}`);
})