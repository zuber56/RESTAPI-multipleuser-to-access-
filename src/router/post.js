const express=require('express')
const Post=require('../models/post')
const auth=require('../middlerware/auth')
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
    .then(data=>{
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