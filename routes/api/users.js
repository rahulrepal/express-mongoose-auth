const express = require('express')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const passport = require('passport')

const secretkey = require('../../config/keys').secretOrKey

// Import User Model
const User = require('../../models/User')

// Initialize router
const router = express.Router()

// Register route POST request
router.post('/register',(req,res)=>{

    const {name,email,password} =req.body

    //find if user already exists
    User.findOne({email})
    .then(user=>{
        if(user)
        return res.status(400).json({email:"Email Already Exists"})

        //if not create new user
        const newUser = new User({
            name,
            email,
            password
        }) 

        //Encrypt password
        bcrypt.genSalt(10,(err,salt)=>{
            bcrypt.hash(newUser.password,salt,(err,hash)=>{
                if(err) throw err

                newUser.password = hash
                //save new user
                newUser.save()
                .then( user => res.json({user}))
                .catch( err => console.log(err))
            })
        })
    })
    .catch(err => console.log(err))
})

//Login route get request
router.get('/login',(req,res)=>{

    const {email,password} = req.body
    //find the user
    User.findOne({email})
    .then( user =>{
        if(!user)
        return res.status(404).json({email:'User Does not exists'})

        //if user exists
        //compare the provided password and encrypted password from the databse
        bcrypt.compare(password,user.password)
        .then( isMatch =>{
            if(isMatch){
                
                const payload = {id:user.id}

                //if password matched
                // send jwt token as response
                jwt.sign(payload,secretkey,{expiresIn:3600},(err,token)=>{
                    res.json({
                        success:true,
                        token:`Bearer ${token}`
                    })
                })
              
            }
            else{
                return res.status(400).json({password:'Password Incorrect'})
            }
        })
    })
})

// dummy protected route
router.get('/current',passport.authenticate('jwt',{session:false}),(req,res)=>{
    res.json({msg:'Success'})
})
module.exports = router