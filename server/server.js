//Use express as a framework over node
const express = require('express')
const app = express()
//Use cors as a middleware, required for WEB apps
const cors = require('cors')
// Use mongoose to use mongoDB
const mongoose = require('mongoose')
// Import userschema 
const User = require('./models/user.model')
// Import Activityschema
const Activity = require('./models/activityModel')
// Use JWT to authenticate users
const jwt = require('jsonwebtoken')
// Env with all private variables
const dotenv = require('dotenv')
const { registerValidation, loginValidation } = require('./validation/validation')
const bcrypt = require("bcrypt")
const jwtDecode = require("jwt-decode");

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
            url: user.url,
            comments: user.comments,
            rating: user.rating,
            interests: user.interests,
            bio: user.bio,
        }, process.env.PRIVATE_KEY)
        return res.json({ status: 200, message: "Profile found", profile: token});
        }
    } catch (error) {
         return res.json({ status: 500, message: "Server Error", profile: false});
    }})


app.post('/app/activities/fetch', async (req, res) => {
    const userToken = req.body.userToken;
    const user = await User.findOne({
        username: jwtDecode(userToken).username,
        email: jwtDecode(userToken).email,
    });
    let filteredActivities = [];
    Activity.find({}, (err, activities) => {
        if (err) {
            console.log(err)
            res.send(err)
            return;
        }
        if (activities.length !== 0) {
            filteredActivities = activities.filter(act => !user.activities.includes(act._id) && !user.deniedActivities.includes(act._id));
            res.send(filteredActivities);
        } else {
            res.send([]);
        }
    });
})

app.post('/app/activities/fetch/filtered', async (req, res) => {
    console.log("in fetch filtered");
    Activity.find({
        activityType: req.body.activityType,
    }, (err, activities) => {
        if (err) {
            console.log(err)
            res.send(err)
            return;
        }
        if (activities.length !== 0) {
            console.log(activities);
            res.send(activities);
        } else {
            res.send([]);
        }
    });
})

app.put('/app/activities/publish', async (req, res) => {
    console.log(req.body);
    const userToken = req.body.userToken;
    console.log(jwtDecode(userToken));
    const user = await User.findOne({
        username: jwtDecode(userToken).username,
        email: jwtDecode(userToken).email,
    });
    console.log(user._id);
    const activityBody = {
        activityName: req.body.activityName,
        activityDate: req.body.activityDate,
        activityType: req.body.activityType,
        minimumAge: req.body.minimumAge,
        maximumAge: req.body.maximumAge,
        activityLocation: req.body.activityLocation,
        minimumGroupSize: req.body.minimumGroupSize,
        maximumGroupSize: req.body.maximumGroupSize,
        dateCreated: req.body.dateCreated,
        creator: user._id,
    }
    const activity = await Activity.insertMany(activityBody);
    console.log(JSON.stringify(activity));
})


app.get('/app/users', async (req, res) => {
    const users = await User.find().limit(50)
    const formatted = users.map(element => jwt.sign({username: element.username, 
        id: element._id, 
        email: element.email, 
        url: element.url, 
        rating: element.rating,
        interests: element.interests}, process.env.PRIVATE_KEY))
    // console.log(formatted)
    res.send({formatted})
})


app.post('/app/users', async (req, res) => {
    const theId = req.body.id
    try{
    const user = await User.findOne({_id: theId})
    const formatted = jwt.sign({username: user.username,  
        email: user.email, 
        url: user.url,
        comments: user.comments,
        rating: user.rating,
        date_joined: user._id.getTimestamp(), 
        activities: user.activities,
        bio: user.bio,
        interests: user.interests}, process.env.PRIVATE_KEY)
     res.send({token: formatted})}
     catch (err){
        res.send({token: false})
     }
    })

app.post('/app/user/search', async (req, res) => {
    const name = req.body.aName
    try{
    const user = await User.findOne({username: name})
    console.log(user)
    const formatted = jwt.sign({id: user._id}, process.env.PRIVATE_KEY)
    res.send({token: formatted})}
    catch (err){
    res.send({token: false})
}
})


app.post('/app/user/search', async (req, res) => {
    const name = req.body.aName
    try{
    const user = await User.findOne({username: name})
    console.log(user)
    const formatted = jwt.sign({id: user._id}, process.env.PRIVATE_KEY)
    res.send({token: formatted})}
    catch (err){
    res.send({token: false})
}
})

app.patch('/app/profile/comment', async (req, res) => {
    User.findOneAndUpdate({username: req.body.username}, 
        { $push: { comments: {body: req.body.comment, rating: req.body.rating, user: req.body.posterUsername } } }, 
        { new: true })
        .exec()
        .then((result) => res.send(result))
        .catch((err) => res.send(err));
})

app.patch('/app/profile/edit', async (req, res) => {
    console.log(req.body);
    User.findOneAndUpdate({username: req.body.username}, req.body, { new: true })
        .exec()
        .then((result) => res.send(result))
        .catch((err) => res.send(err));})

app.patch('/app/activity/leave', async (req, res) => {
    const userToken = req.body.userToken;
    const activityID = req.body.activityID;
    User.findOneAndUpdate({
        username: jwtDecode(userToken).username,
        email: jwtDecode(userToken).email,
    }, { $pull:
            {
                activities: activityID
            }
    }, { new: true })
        .exec()
        .then((result) => res.send(result))
        .catch((err) => res.send(err));
})

app.patch('/app/activity/join', async (req, res) => {
    const userToken = req.body.userToken;
    const activityID = req.body.activityID;
    console.log("in add activity on server");
    User.findOneAndUpdate({
        username: jwtDecode(userToken).username,
        email: jwtDecode(userToken).email,
    }, { $push:
            {
                activities: activityID
            }
    }, { new: true })
        .exec()
        .then((result) => res.send(result))
        .catch((err) => res.send(err));
})

app.patch('/app/activity/deny', async (req, res) => {
    const userToken = req.body.userToken;
    const activityID = req.body.activityID;
    console.log("in deny activity on server");
    User.findOneAndUpdate({
        username: jwtDecode(userToken).username,
        email: jwtDecode(userToken).email,
    }, { $push:
            {
                deniedActivities: activityID
            }
    }, { new: true })
        .exec()
        .then((result) => res.send(result))
        .catch((err) => res.send(err));
})

app.patch('/app/activity/increase', async (req, res) => {
    console.log("in add participant on server");
    Activity.findOneAndUpdate({
        _id: req.body.activityID,
    }, { $inc:
            {
                participators: 1
            }
    }, { new: true })
        .exec()
        .then((result) => {
            console.log(result.participators);
            res.send(result)
        })
        .catch((err) => res.send(err));
})

app.post('/app/users/activities', async (req, res) => {
    const actId = req.body.actId
    try{
        const activity = await Activity.findOne({_id: actId})
        const formatted = jwt.sign({activityName: activity.activityName, activityType: activity.activityType}, process.env.PRIVATE_KEY)
        res.send({token: formatted})}
        catch (err){
        res.send({token: false})
    }

})


app.listen(4000, () => {console.log("Server is up and running")})


