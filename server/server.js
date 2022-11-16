
const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const User = require('./models/user.model')
const jwt = require('jsonwebtoken')

// "mongodb+srv://admin:admin123@cluster0.a8kdzoo.mongodb.net/test?retryWrites=true&w=majority"
app.use(cors())
app.use(express.json())

mongoose.connect("mongodb+srv://admin:admin123@cluster0.a8kdzoo.mongodb.net/test?retryWrites=true&w=majority", ()=> console.log('Database connected'))

app.post('/app/register', async (req, res) => {
    console.log(req.body)
    try {
        await User.create({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
        })
       res.json({status: 'ok'})
    } catch (err) {
        res.json({status: 'error', error: 'Duplicate email'})
    }
})


app.post('/app/login', async (req, res) => {
       const user = await User.findOne({username: req.body.username, password: req.body.password
    })
    if (user) {
        const token = jwt.sign({
            username: user.username,
            email: user.email

        }, 'secret123')
        return res.json({status: 'ok', user: token})
    } else {
        return res.json({status: 'ok', user: false})
    }

})

app.listen(4000, () => {console.log("Server is up and running")})