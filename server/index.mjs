import express from "express"
import mongoose from "mongoose"

const app = express()
mongoose.connect()
const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`Server is listening ${PORT}`);

})