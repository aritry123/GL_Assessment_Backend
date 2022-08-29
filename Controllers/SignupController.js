const express=require('express')
const router=express.Router()
const userModel=require('../Models/UserModel')
router.post('/signup',(req,res)=>{
    const data=req.body
    if(data.password==='admin'){
        const obj=new userModel({
            fname:data.fname,
            email:data.email,
            password:data.password,
            phone:data.phone,
            role:'admin'
        })
        obj.save().then((result)=>res.send({"msg":"signup succeeded","status":true})).catch((e)=>res.send({"msg":"some error occured, try again!","status":false}))
    }else{
        const obj=new userModel({
            fname:data.fname,
            email:data.email,
            password:data.password,
            phone:data.phone
        })
        obj.save().then((result)=>res.send({"msg":"signup succeeded","status":true})).catch((e)=>res.send({"msg":"some error occured, try again!","status":false}))
    }
})
module.exports=router