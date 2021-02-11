const express=require('express')
const User=require('../models/user')        // models file to access in all the fill
const bcrypt=require('bcrypt')              // password bcrypt for data 
const auth=require('../middlerware/auth')   // it used to middlerware in authorization
const multer=require('multer')              // image storge in multer method for working the deskstorge  
const path=require('path')                  // it is used to setting the file to main path
const router = new express.Router()         // this is router method to calling main connection app 
const Post=require('../models/post')
const { find } = require('../models/user')
const { Console } = require('console')
const { title } = require('process')

//--->The disk storage engine gives you full control on storing files to disk.
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'src/images');
    },
    filename: (req, file, cb) => {
        // console.log(file);
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
//---> The file upload manage in image 
const upload=multer({
    dest:'images',
    limits:{
        fileSize:1000000
    },
    storage:storage,
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload an image'))
        }
       cb(undefined, true)
    },
})
//--------------------------------->d
// register user
//---------------------------------
router.post('/reg/user',upload.single('upload'),async(req,res)=>{
    const name=req.body.name;
    const email=req.body.email;
    const password=req.body.password;
    const image=req.file.filename;
    const Userbcrypt = bcrypt.hashSync(password, 8)
    
    const data= await User.findOne({ email: email })
    if(data){
        return res.json({
            err:"email is already exists "
        })
    }
    else{

            const user = new User({
                name : name,
                email : email,
                image:image,
                password : Userbcrypt,
                
            })  
            const data =User(user)
            //console.log(data)
            const token = await user.generateAuthToken()
            await user.save()
            .then(data=>{
                res.send({
                    status:404,
                    message:"USER data is successfully",
                    data:data
                })
            }).catch((err)=>{
                res.send({
                    status:400,
                    message:"error",
                    data:err
                })
            })
    }
})
//-------------------------------------------->d
// User create by post details show
//-------------------------------------------->
router.get('/userfind/:id',auth,async(req,res)=>{
    const _id=req.params.id
    const userss=await User.findById(_id)
    let userinfd= await Post.find({user:userss})
    req.send(userinfd)
    .then((data)=>{
        res.send({
            status:400,
            data:data.password.undefined
        })
    }).catch((err)=>{
        res.send({
            status:404,
            message:"err",
            data:err
        })
    })
   // res.send(userinfd)
       
    // if(userinfd){
    //     res.send(userinfd)        
    //     if(user.user)
    //             {
    //                 res.send(userinfd)
    //             }
    //         }
  
           // res.send(user._id)
    
               //const _id=req.params.id
       
        //const userfind=await Post.findById(_id)
     
    
    // try {
    //     const user =await User.findById(_id)
    //     if(user){
    //         const _id=req.params.id
    //         const userfind = await Post.find()
    //         if(user == userfind){

    //             res.send(userfind)
    //         }
            
    //     }
    //     res.send(user)
    // } catch (error) {
        
    // }
 //   User.findById()
})

//-------------------------------------------------->
//post id access post data show all data user to show
//-------------------------------------------------->
router.get('/users/:id',async(req, res) => {


    // const _id = req.params.id
    // const userss=await Post.findById(_id).populate('User');   https://www.toptal.com/nodejs/smart-node-js-form-validation
    //const userss=await User.findOne()
    // res.send(userss.name)
   const _id = req.params.id
   const userfind= await Post.findById(_id).populate('user')
    //res.send(userfind)
    if(userfind){
        userfind.user.password = undefined      // field hedden must be use to hide the data    
        userfind.user.tokens = undefined      //
        res.send(userfind)
    }
    // .then((data)=>{
    //     res.send({
    //         data:data,
    //     })
    // }).catch((err)=>{

    // })

})


//---------------------------------------->
//post id all data user to show
//---------------------------------------->
router.get('/user/:id',async (req, res) => {
    const _id = req.params.id
    const userss=await User.findOne()
    let userinfd= await Post.find({user:userss})
    res.send(userss)
})
module.exports=router