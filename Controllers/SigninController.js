const express=require('express')
const router=express.Router()
const userModel=require('../Models/UserModel')
const jwt=require('jsonwebtoken')
// const cookie=require('cookie-parser')
// router.use(cookie())
router.post('/signin',(req,res)=>{
    const data=req.body
    userModel.findOne({email:data.email}).then((result)=>{
        if(result){
            if(data.password===result.password){
                const token=jwt.sign({email:data.email,role:result.role},'aritry')
                res.status(200).cookie('tokenauth',token,{sameSite:'strict',httpOnly:true}) // ,maxAge:3600000
                res.send({"msg":'you are authenticated',"status":true,"role":result.role})
            } else {
                res.send({"msg":'password is wrong, authentication failed!',"status":false})
            }
        }
        else{
            res.send({"msg":"email id doesn't exist","status":false})
        }
    }).catch((e)=>res.send({"msg":"some error occured","status":false}))
})
router.post('/signout',(req,res)=>{
    const cookieip=req.cookies.tokenauth
    if(cookieip){
        try{
            const decodedtoken=jwt.verify(cookieip,'aritry')
            res.clearCookie('tokenauth').status(200).send({"msg":"cookie is seen and removed","status":true})
        }
        catch(e){
            res.status(404).send({"msg":"cookie verification error","status":false})
        }
    }
})
module.exports=router