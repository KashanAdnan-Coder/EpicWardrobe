import express from "express"
import dotenv from "dotenv"
dotenv.config()
import connectDatabase from "./database/index.mjs"

const app = express()
const PORT = process.env.PORT || 3000
connectDatabase(process.env.MONGODB_URI)

app.listen(PORT, () => {
    console.log(`Server is listening ${PORT}`);

})