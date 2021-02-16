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
//const cryptr=require('cryptr')
// cryptr=require('crypto')
var crypto = require("crypto");


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
    console.log("{}{}{{}{{}{{}{")
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
           // const r=cryptr.decrypt(Userbcrypt)
         // console.log(r)
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
   const userinfd=  await Post.find({user:userss})
   //res.send(userinfd)
  
    .then(data=>{
        res.send({
            status:400,
            data:data
        })
    }).catch((err)=>{
        res.send({
            status:404,
            message:"err",
            data:err
        })
    })
})

//-------------------------------------------------->
//post id access post data show all data user to show   // https://www.toptal.com/nodejs/smart-node-js-form-validation
//-------------------------------------------------->
router.post('/users/:id',async(req, res) => {

    const _id = req.params.id  

    const postUser = [_id];
    //const userpost=req.body.postuser

    const postUserID = req.body._id;
    //const postUser = [];
    if(_id==postUserID){
        console.log(_id,postUserID)
    }

   // console.log(postUser)
    const userfind= await Post.findById(_id).populate('user')
    console.log(userfind)
    if(userfind){
        const update={
            userpost:userfind.user.userpost
        }
        console.log(update)
        const upsuerpost= await Post.findByIdAndUpdate(req.params.id,update)
        //console.log(upsuerpost)
    }
    if(userfind){
        userfind.user.password = undefined                              // field hedden must be use to hide the data    
        userfind.user.tokens = undefined  
        userfind.user.image = undefined      
        userfind.user.email = undefined
       
        res.send(userfind)
    }else{
    }
})
//---------------------------------------->
// password rest in user to new create pass
//---------------------------------------->
router.post('/user/pass',async(req,res)=>{

    var data = await User.findOne({email:req.body.email})
   let passwordchng=req.body.password 
   const Userbcrypt = bcrypt.hashSync(passwordchng, 8)
    const updatedata ={
        password:Userbcrypt
    }
    console.log(data.email)
      const UserUpdatae=await User.findOneAndUpdate(data.email,updatedata);
     if(UserUpdatae)
     {
         res.status(200).json({
             messgae:"password changed"
         })
    }
    else
    {
        res.status(400).json({
            error:"wrong"
        })
    }
    console.log(UserUpdatae)
})
//---------------------------------------->
//user follows and following create API 
//---------------------------------------->

router.post('/follow/:id',auth,async(req,res)=>{
    const id = req.params.id;                            //url id
    const requestid = req.user._id;       
                   // auth
    const updatedata = {accept:0,request_by:requestid};   //auth id 
    const updatedata1 = {accept:0,request_by:id};   //auth id 

    //console.log("{}{}{{}",updatedata)
//-------------------followers------------------------------------->
   await User.findById(id).then(async(ress) => 
       {
        const data = ress.followers                           //console.log("{}{{{}----",data)
        if( data.toString()==[].toString()){
             await User.findByIdAndUpdate(
                {_id:ress._id},
                { $push: { followers:updatedata } },
                );
        }
        else{
            data.forEach(async(d1) => { 
                //console.log("knhjjhfthnhm nhkj",d1.request_by.toString() === requestid.toString())
                if(d1.request_by.toString() === requestid.toString()){
                    return res.status(200).json({
                        messgae:"you have already sent the following a request"
                    })
                }else{
                    console.log("first time")
                }
            });
        }       
  })   
//-------------------following----------------------------------->
  await User.findById(requestid).then(async(data)=>{
    //console.log("following>>>>>>>>>",data)
    const data1= data   
    console.log(data1)
    console.log("{}{}{}{{}{}",id)
    if(data1){
        console.log(data1)
       await User.findByIdAndUpdate(
           {_id:data._id},
           {$push:{following:updatedata1}}
       );
    }else{
        data1.forEach(async(d2)=>{
            if(d2.request_by.toString() === requestid.toString()){
                return res.status(200).json({
                    message:"you hava already sent the followers a resquest"
                })
            }else{
                    console.log("second time")
            }
        })
    }
    
   })
})
//---------------------------------------->
//user following and following create API 
//---------------------------------------->
router.post('/acceptuser/:id',auth,async(req,res)=>{
           //auth id 
           const id=req.params.id
           const requestid = req.user._id;
           const updatedata = {accept:1};
           const data = await User.findOne({_id:id})
           const data1 = data.following;
           data1.forEach(async(d2)=>{
            if(requestid.toString() === d2.request_by.toString())
            {    
                    const da123 = await User.findByIdAndUpdate(
                                    {_id:requestid},
                                    { $set: {followers:updatedata} },
                    );                 
            }           
        })
        const d1 = await User.findOne({_id:id});
        const d3 = d1.following;
        d3.forEach(async(data)=>{
            if(requestid.toString() === data.request_by.toString())
            {    
                    const da123 = await User.findByIdAndUpdate(
                                    {_id:id},
                                    { $set: {following:updatedata} },
                    );
            }           
        })
//            const updatedata1 = {accept:0,request_by:id};
//     await User.findById(id).then(async(data) => 
//        {
       
//         const updatedata = {accept:1};  
//         console.log("gggggggggggggggggg",data.id)                          //console.log("{}{{{}----",data)
//         if(data){
//           const data2=await User.findByIdAndUpdate(
//                 {_id:data.id},
//                 { $set: {followers:{accept: updatedata}} },
//                 );
//                 console.log(data2)
//         }else{
//             console.log('>>>>>>>>>>>')
//             // data.forEach(async(d1) => { 
//             //     //console.log("knhjjhfthnhm nhkj",d1.request_by.toString() === requestid.toString())
//             //     if(d1.accept.toString() === requestid.toString()){
//             //         return res.status(200).json({
//             //             messgae:"you have already sent the data accept"
//             //         })
//             //     }else{
//             //         console.log("first time")
//             //     }
//             // });
//         } 
//         //--------------------------------
              
//   }) 
//  await User.findById(updatedata1).then(async(data) => 
//        {
       
//         const updatedata = {accept:1};  
//         console.log("gggggggggggggggggg",data.id)                          //console.log("{}{{{}----",data)
//         if(data){
//           const data2=await User.findByIdAndUpdate(
//                 {_id:data.id},
//                 { $set: {followers:{accept: updatedata}} },
//                 );
//                 console.log(data2)
//         }else{
//             console.log("+++++++")
//         }
//     })
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