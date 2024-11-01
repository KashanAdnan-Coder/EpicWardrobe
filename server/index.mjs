import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
dotenv.config()
import { v2 as cloudinary } from 'cloudinary';
import connectDatabase from "./database/index.mjs"
import userRoute from "./routes/user.routes.mjs"
import productRoute from "./routes/product.routes.mjs"

const app = express()
app.use(express.json())
app.use(cookieParser())
app.use("/api/v1/users", userRoute)
app.use("/products", productRoute)
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.api_key,
    api_secret: process.env.api_secret
});
const PORT = process.env.PORT || 3000
connectDatabase(process.env.MONGODB_URI)

app.listen(PORT, () => {
    console.log(`Server is listening ${PORT}`);
})