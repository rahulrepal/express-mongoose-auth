const express = require('express')
const bodyParser = require('body-parser')

const mongoose = require('mongoose')
const mongoURI = require('./config/keys').mongoURI

const users = require('./routes/api/users')


const passport = require('passport')

//Initalize App
const app = express()

//Initial Body Parse
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

//passport middleware
app.use(passport.initialize())

//passport config
require('./config/passport')(passport)

//Connect to mongoose
mongoose.connect(mongoURI)
.then(()=>console.log("Mongo DB connected"))
.catch(err => console.log(err))

// set Routes
app.get('/',(req,res)=> res.send('Hello'));
app.use('/api/users',users)


// run server i.e listen
const port = process.env.PORT || 5000
app.listen(port,()=> console.log(`Server running on ${port}`))
