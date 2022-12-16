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
const activityModel = require('./models/activityModel')

dotenv.config();

//middlewares
app.use(cors())
app.use(express.json())

mongoose.connect(process.env.DB_CONNECTION, ()=> console.log('Database connected'))

 app.post('/app/register', async (req, res) => {
     try {
         // Validate the given input
         formattedInput = {username: req.body.username, email: req.body.email, password: req.body.password}
         const { error } = registerValidation(formattedInput)
         if (error) 
         // if the requirements of all fields aren't met (if data changed with JS or payload edited )
          return res.json({ status: 400, message: "Invalid fields"});
         // See if a user already exists with this username
        const user = await User.findOne({username: req.body.username, email: req.body.email});
        if (user) {
         return res.json({ status: 409, message: "User with given username already exists"});
        }
         // Hash the password and salt it with certain complexity 
         const hashedPassword = await bcrypt.hash(req.body.password, 10);
         await User.create({
            username: req.body.username,
             email: req.body.email,
             password: hashedPassword,
             interests: req.body.interests
         })
         //await ProfileUser.create({username: req.body.username})
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
        console.log(user);
        const validPwd = await bcrypt.compare(req.body.password, user.password)
        // Passwords do not match
        if (!validPwd) return res.json({ status: 401, message: "Invalid username or password", user: false});
        //Successful login, authenticate the user 
        const token = jwt.sign({
            username: user.username,
            email: user.email

        },  process.env.PRIVATE_KEY)
        return  res.json({ status: 200, message: "Logged in successfully", user: token});
    }
    } catch (error) {
        return res.json({ status: 500, message: "Server Error", user: false});
    }
})

app.post('/app/login/auth/google', async (req, res) => {
    // Validate given input
    const userInfo = req.body
    try{
    const user = await User.findOne({username: userInfo.username, email: userInfo.email})
    if (!user){
        await User.create({
            username: req.body.username,
            email: req.body.email,
            password: "googlepasswordD1"
         })
       }
    const token = jwt.sign({
    username: userInfo.username,
    email: userInfo.userEmail},  
    process.env.PRIVATE_KEY)
    return  res.json({ status: 200, message: "Logged in successfully", user: token});
    } catch (error){
        return res.json({ status: 500, message: "Server Error", user: false});
    }
})

app.post('/app/profile', async (req, res) => {
    try {
        const user = await User.findOne({
            username: req.body.username,
        })
        if(user) {
        const token = jwt.sign({
            username: user.username,
            email: user.email,
            url: user.url
            comments: user.comments,
        }, process.env.PRIVATE_KEY)
        return res.json({ status: 200, message: "Profile found", profile: token});
        }
    } catch (error) {
         return res.json({ status: 500, message: "Server Error", profile: false});
    }})

app.put('/app/profile/edit', async (req, res) => {
    console.log(req.body);
    User.findOneAndUpdate({username: req.body.username}, req.body, { new: true })
        .exec()
        .then((result) => res.send(result))
        .catch((err) => res.send(err));})


app.get('/app/map', async (req, res) => {
   // const activities = await activityModel.find()
   // res.send(activities)
   res.send([{lat:50.81, lon:4.3, activityName: "Bowling", date: new Date("2022-12-17")},
   {lat: 50.80, lon:4.311, activityName: "ice skating", date: new Date("2022-12-18")},
   {lat: 50.768, lon:4.29, activityName: "dancing", date: new Date("2022-12-18")}])
})

app.patch('/app/profile/comment', async (req, res) => {
    User.findOneAndUpdate({username: req.body.username}, { $push: { comments: req.body.comment } }, { new: true })
        .exec()
        .then((result) => res.send(result))
        .catch((err) => res.send(err));})

app.listen(4000, () => {console.log("Server is up and running")})


