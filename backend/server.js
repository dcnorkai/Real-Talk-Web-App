const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const userRoutes =require('./routes/userRoutes');
const chatRoutes =require('./routes/chatRoutes');
const messageRoutes = require("./routes/messageRoutes")
const app = express();
const path = require('path')
dotenv.config();

const connectDB = async() => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("MongoDB Connected Successfully")
    } catch (error) {
        console.log(error)
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

app.use('/api/user',userRoutes)
app.use('/api/chat',chatRoutes)
app.use('/api/message',messageRoutes)

// -------------------------------------------Deployment-------------------------------------------

const __dirname1 = path.resolve()
if(process.env.NODE_ENV==='production') {
    app.use(express.static(path.join(__dirname1, "/frontend/build")))
    app.get('*',(req,res)=>{
        res.sendFile(path.resolve(__dirname1,"frontend","build","index.html"))
    })
} else {
    app.get('/', (req,res) => {
        res.send("API is working");
    });
}

// ------------------------------------------------------------------------------------------------

app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT

const server = app.listen(PORT,console.log("Backend server is running"));

const io = require('socket.io')(server,{
    pingTimeout:60000, //Save bandwith by closing the connection after 60 seconds
    cors: {
        origin: "http://localhost:3000"
    },
})

io.on("connection", (socket) => {
    console.log("connected to socket.io");
    socket.on('setup', (userData) => {
        socket.join(userData._id)
        // console.log(userData._id)
        socket.emit('connected')
    })
    socket.on("join chat", (room) => {
        socket.join(room)
        console.log("User Joined Room: " + room)
    })

  socket.on("new message", (newMessageRecieved) => {
    var chat = newMessageRecieved.chat;

    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) return;

      socket.in(user._id).emit("message recieved", newMessageRecieved);
    });
  });

  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });
})