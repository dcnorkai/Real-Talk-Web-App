const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')
const jwt = require('jsonwebtoken')

const generateToken = (id) => {
    return jwt.sign({id},process.env.JWT_SECRET, {
        expiresIn: "12d",
    })
}

// Middleware for user authorization
const protect = asyncHandler(async (req,res,next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        try {
            token = req.headers.authorization.split(" ")[1];

            const decoded = jwt.verify(token, process.env.JWT_SECRET)

            req.user = await User.findById(decoded.id).select("-password")

            next()

        } catch (error) {
            res.status(401)
            throw new Error("Invalid token, authorization failed")
        }
    }

    if(!token) {
        res.status(401)
        throw new Error("Not authorized, no token")
    }
})

const authUser = asyncHandler(async(req,res)=>{
    const {email,password} = req.body;
    const user = await User.findOne({email});

    if(user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            pic: user.pic,
            token: generateToken(user._id),
        })
    }else{
        res.status(401)
        throw new Error("Invalid email or password")
    }
})

const registerUser = asyncHandler(async (req,res) => {
    const {name,email,password,pic} = req.body

    if(!name || !email || !password) {
        res.status(400);
        throw new Error("Please enter all the fields")
    }

    const userExists = await User.findOne({email})

    if(userExists) {
        res.status(400);
        throw new Error("User already exists")
    }

    const user = await User.create({
        name,email,password,pic
    })

    if(user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            pic: user.pic,
            token: generateToken(user._id),
        })
    }else {
        res.status(400);
        throw new Error("Failed to create new user")
    }
});

const allUsers = asyncHandler(async(req,res) => {
    const keyword = req.query.search ? {
        $or: [
            { name: { $regex: req.query.search, $options: "i"} },
            { email: { $regex: req.query.search, $options: "i"} },
        ]
    }
    : {};

    const users = await User.find(keyword).find({_id: { $ne: req.user._id }})
    res.send(users);
});

module.exports = { registerUser, authUser, allUsers, protect };