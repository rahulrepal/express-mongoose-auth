// To extract information from jwt
const JWTStrategy = require('passport-jwt').Strategy
const ExtractJWT = require('passport-jwt').ExtractJwt

const secretOrKey= require('../config/keys').secretOrKey

const mongoose = require('mongoose')

//import user nidek
const User = mongoose.model('users')

const opts={}

//set the options
opts.jwtFromRequest = ExtractJWT.fromAuthHeaderAsBearerToken();
opts.secretOrKey = secretOrKey

module.exports = passport =>{
    passport.use(new JWTStrategy(opts,(jwt_payload,done)=>{
        User.findById(jwt_payload.id)
        .then(user =>{
            if(user){
                return done(null,user)
            }
            return done(null,false)
        })
        .catch( err => console.log(err))
    }))
}