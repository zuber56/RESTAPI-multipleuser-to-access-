const express=require('express')
const mongoose=require('mongoose')
const { MONGOURI } = require('./src/db/monoose');
const app = express()
const bodyParser = require('body-parser');
require('path')
const port=process.env.PORT ||3000          // killall -s KILL node (server not control the using the command) 

//api call method
const userRouter=require('./src/router/user')
const postRouter=require('./src/router/post')

//---------------------------------------------------

mongoose.connect(MONGOURI,{
    useCreateIndex:true,
    useFindAndModify:false,
    useNewUrlParser:true,
    useUnifiedTopology:true,
    
}).then(() => console.log("connected to mongodb")).catch((err) => console.log(err))

//API index
app.get('/mul/user',(req,res)=>{
    console.log('hiiii')
})


//user
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json())
app.use('/',userRouter)
app.use('/',postRouter)

//--------------------------------------------------
app.listen(port, () => {
    console.log('Server is up on port ' + port)
})