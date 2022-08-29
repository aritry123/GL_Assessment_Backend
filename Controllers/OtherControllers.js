const express=require('express')
const router=express.Router()
const userModel=require('../Models/UserModel')
const jwt=require('jsonwebtoken')
router.post('/create',(req,res)=>{
    const data=req.body
    // console.log(data)
    // console.log(req.cookies)
    // console.log(req.cookies.tokenauth)
    const cookieip=req.cookies.tokenauth
    const decodedtoken=jwt.verify(cookieip,'aritry')
    if(decodedtoken.role==='admin'){
        const data=req.body
        if(data.password==='admin'){
            const obj=new userModel({
                fname:data.fname,
                email:data.email,
                password:data.password,
                phone:data.phone,
                role:'admin'
            })
            obj.save().then((result)=>res.send({"data":result,"msg":'created contact',"status":true})).catch((e)=>res.send({"msg":"some error occured, try again!","status":false}))
        }else{
            const obj=new userModel({
                fname:data.fname,
                email:data.email,
                password:data.password,
                phone:data.phone
            })
            obj.save().then((result)=>res.send({"data":result,"msg":'created contact',"status":true})).catch((e)=>res.send({"msg":"some error occured, try again!","status":false}))
        }
    }else{
        res.send({"msg":"You are not authorized!","status":false})
    }
})
module.exports=router