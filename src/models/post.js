const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const userSchema = new mongoose.Schema({
    
    title: {
        type: String,
    },
    body: {
        type: String,
    },
    user:{
        type:Schema.Types.ObjectId,
        ref:'User'                      //models name to defined
    }
})
const User = mongoose.model('Post', userSchema)
module.exports = User

// titile: "ddd",
// body: "ddd",
// user: {
//     name: "ddd",
//     email: "ddd"
// }
