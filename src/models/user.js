const mongoose = require('mongoose')
//const bcrypt = require('bcryptjs')
//const bcrypt=require('bcrypt')
const jwt = require('jsonwebtoken')

const Schema = mongoose.Schema;

//const bcrypt = require('bcryptjs')
//const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    //_id:Schema.Types.ObjectId,
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
    }
    ,tokens: [{
        token: {
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




// module.exports = {
//     'Author': require('./Author'),
//     'Book': require('./Book'),
//   };
