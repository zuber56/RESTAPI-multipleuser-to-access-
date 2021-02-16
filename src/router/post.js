const express=require('express')
const Post=require('../models/post')
const auth=require('../middlerware/auth')
const User = require('../models/user')
const router = new express.Router()



//------------------------------------------------
router.post('/user/post',auth,async(req,res)=>{
    const title=req.body.title;
    const body=req.body.body;
    
    const user=req.user
    console.log(user)
    const post=new Post({
      title:title,
      body:body,
      user:user
    })
   // const data =Post(post)
    //console.log(data)
    
    await post.save()
    .then(async(data)=>{
        await User.findOne(user._id)
        .then(async(res) => {
            const d1 = await User.findByIdAndUpdate(
                {_id:user._id},
                { $push: { userpost:data._id } },
            );
            console.log("123456789",d1)
            // await User.findByIdAndUpdate()
        }).catch((error) => {
            console.log("1324646",error)
        })
       res.send({
            status:404,
            message:"POST data is successfully",
            data:data
        })
    }).catch((err)=>{
        console.log(err)
        res.send({
            status:400,
            message:"error",
            data:err
        })
    })

})
//------------------------------------------------
//---------auth calling data   
router.get('/reg/post',auth,(req,res)=>{
    console.log('post----------')
    console.log(req.user)
})
module.exports=router