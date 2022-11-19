//Use express as a framework over node
const express = require('express')
const app = express()
//Use cors as a middleware, required for WEB apps
const cors = require('cors')
// Use mongoose to use mongoDB
const mongoose = require('mongoose')
// Import userschema 
const User = require('./models/user.model')
// Use JWT to authenticate users
const jwt = require('jsonwebtoken')
// Env with all private variables
const dotenv = require('dotenv')
const { registerValidation, loginValidation } = require('./validation/validation')
const bcrypt = require("bcrypt")

dotenv.config();

//middlewares
app.use(cors())
app.use(express.json())

mongoose.connect(process.env.DB_CONNECTION, ()=> console.log('Database connected'))



 app.post('/app/register', async (req, res) => {
     try {
         // Validate the given input
         const { error } = registerValidation(req.body)
         if (error) 
         // if the requirements of all fields aren't met (if data changed with JS or payload edited )
          return res.json({ status: 400, message: "Invalid fields"});

         // See if a user already exists with this username
        const user = await User.findOne({username: req.body.username});
         if (user)
         return res.json({ status: 409, message: "User with given username already exists"});
         console.log(1)
       // Hash the password and salt it with certain complexity 
         // const salt = await bcrypt.genSalt(10);
         const hashedPassword = await bcrypt.hash(req.body.password, 10);
         await User.create({
             username: req.body.username,
             email: req.body.email,
            password: hashedPassword,
         })
         console.log(req.body.password)
        return res.json({ status: 201, message: "User created successfully"})
    } catch (err) {
         // in case of no reply from server
         return res.json({ status: 500, message: err})
     }
 })


app.post('/app/login', async (req, res) => {
    try {
        // Validate given input
        const { error } = loginValidation(req.body)
        if (error) return res.json({ status: 400, message: "Invalid fields", user: false});

        // See if user exists
        const user = await User.findOne({
            username: req.body.username
    })

    //if user exists, compare the passwords to eachother

    if (user) {
        const validPwd = await bcrypt.compare(req.body.password, user.password)
        // Passwords do not match
        if (!validPwd) return res.json({ status: 401, message: "Invalid username or password", user: false});
        //Successful login, authenticate the user 
        const token = jwt.sign({
            username: user.username,
            email: user.email

        },  process.env.PRIVATE_KEY
        )
        return  res.json({ status: 200, message: "Logged in successfully", user: token});
    } 
    } catch (error) {
        return res.json({ status: 500, message: "Server Error", user: false});
    }
})



app.listen(4000, () => {console.log("Server is up and running")})