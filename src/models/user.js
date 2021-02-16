const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
//const bcrypt=require('bcrypt')
//const jwt = require('jsonwebtoken')
//const bcrypt = require('bcryptjs')

const Schema = mongoose.Schema;
const userSchema = new mongoose.Schema({
    name:{
        type: String,
    },
    email:{
        type: String,
    },
    password:{
        type:String,
    },image:{
        type:String,
    },
    userpost:{
        type:Array
    },  
    followers: [
        {
        request_by: {
            type:mongoose.Types.ObjectId,
            ref: "user",
          },
          accept: 0,
    }],
    following: [
        {
        request_by: {
            type: mongoose.Types.ObjectId,
            ref: "user",
          },
          accept: 0,
    }]
    ,tokens:[{
        token:{
            type: String,
        }
    }],
})
userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, 'thisismynewcourse')
    user.tokens = user.tokens.concat({ token })
    await user.save()
    return token
}
//--------------------------------------------
const User = mongoose.model('User', userSchema)
module.exports = User



