const express = require("express");
const dotenv = require("dotenv");
const {chats} = require("./data/data");
const mongoose = require("mongoose");
const userRoutes =require('./routes/userRoutes');
const chatRoutes =require('./routes/chatRoutes');

const app = express();
dotenv.config();

const connectDB = async() => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("MongoDB Connected Successfully")
    } catch (error) {
        console.log("Error")
        process.exit()
    }
}

const notFound = (req,res,next) => {
    const error = new Error('Not Found - ${req.originalUrl}');
    res.status(404);
    next(error);
}

const errorHandler = (err,req,res,next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === "production" ? null : err.stack,
    })
}

connectDB();

app.use(express.json())

app.get('/', (req,res) => {
    res.send("API is working");
});

app.use('/api/user',userRoutes)
app.use('/api/chat',chatRoutes)

app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT

app.listen(PORT,console.log("Backend server is running"));