const express=require('express')
const app=express()
const bp=require('body-parser')
const cors=require('cors')
app.use(cors({origin:'http://localhost:3000',credentials:true}))
app.use(bp.json())
const cookie=require('cookie-parser')
app.use(cookie())
const jwt=require('jsonwebtoken')
const userModel=require('./Models/UserModel')
const signup=require('./Controllers/SignupController')
const signin=require('./Controllers/SigninController')
const others=require('./Controllers/OtherControllers')
app.use('/',signup)
app.use('/',signin)
app.use('/',others)
app.get('/get',(req,res)=>{
    userModel.find({activation:true}).then((result)=>res.send({"data":result,"msg":'all contacts',"status":true})).catch((e)=>res.send({"msg":"error occured!","status":false}))
})
app.get('/getAll',(req,res)=>{
    userModel.find().then((result)=>res.send({"data":result,"msg":'all contacts',"status":true})).catch((e)=>res.send({"msg":"error occured!","status":false}))
})
app.post('/delete/:id',(req,res)=>{
    const cookieip=req.cookies.tokenauth
    const decodedtoken=jwt.verify(cookieip,'aritry')
    if(decodedtoken.role==='admin'){
        userModel.deleteOne({_id:req.params.id}).then((result)=>res.status(200).send({"data":result,"msg":"deleted successfully","status":true})).catch((err)=>res.status(500).send({"msg":"error in deleting","status":false}))
    }else{
        res.send({"msg":"You are not authorized!","status":false})
    }
})
app.post('/update/:id',(req,res)=>{
    const data=req.body
    const cookieip=req.cookies.tokenauth
    const decodedtoken=jwt.verify(cookieip,'aritry')
    if(decodedtoken.role==='admin'){
        userModel.updateOne({_id:req.params.id},{
            $set:{
                fname:data.fname,
                email:data.email,
                password:data.password,
                phone:data.phone
            }
        }).then((result)=>res.send({"data":result,"msg":"updated successfully","status":true})).catch((e)=>res.send({"msg":"error in updating","status":false}))
    }else{
        res.send({"msg":"You are not authorized!","status":false})
    }
})
app.post('/change/:id',(req,res)=>{
    const data=req.body
    const cookieip=req.cookies.tokenauth
    const decodedtoken=jwt.verify(cookieip,'aritry')
    if(decodedtoken.role==='user'){
        userModel.updateOne({_id:req.params.id},{
            $set:{
                password:data.password
            }
        }).then((result)=>res.send({"data":result,"msg":"password updated successfully","status":true})).catch((e)=>res.send({"msg":"error in updating password","status":false}))
    }else{
        res.send({"msg":"You are not authorized!","status":false})
    }
})
app.post('/deactivate/:id',(req,res)=>{
    const data=req.body
    const cookieip=req.cookies.tokenauth
    const decodedtoken=jwt.verify(cookieip,'aritry')
    if(decodedtoken.role==='user'){
        userModel.updateOne({_id:req.params.id},{
            $set:{
                activation:data.activation
            }
        }).then((result)=>res.send({"data":result,"msg":"activation status updated successfully","status":true})).catch((e)=>res.send({"msg":"error in updating activation status","status":false}))
    }else{
        res.send({"msg":"You are not authorized!","status":false})
    }
})
app.post('/lock/:email',(req,res)=>{
    userModel.updateOne({email:req.params.email},{
        $set:{
            lock:true,
            time:Date.now()
        }
    }).then((result)=>res.send({"msg":"Profile is locked!","status":true})).catch((error)=>res.send({"msg":"Error in locking profile!","status":false}))
})
app.post('/unlock/:email',(req,res)=>{
    userModel.updateOne({email:req.params.email},{
        $set:{
            lock:false,
            time:0
        }
    }).then((result)=>res.send({"msg":"Profile is unlocked!","status":true})).catch((error)=>res.send({"msg":"Error in unlocking profile!","status":false}))
})
app.listen(3001,()=>console.log('server started'))