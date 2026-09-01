import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

app.use(cores({
    origin : process.env.CORS_ORIGIN,
    Credential : true
}))

app.use(express.json({limit : "16kb"}))
app.use(express.urlencoded({extended:true,limit : "16kb"}))
app.use(express.static("public"))

app.use(cookieParser())


const app = express()

export { app } 