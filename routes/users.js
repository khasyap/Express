var express = require('express');
var router = express.Router();
var bcrypt=require('bcryptjs');
var Users=require('../models/users');
var nodemailer=require('nodemailer');
var jwt=require('jsonwebtoken');
const { status } = require('express/lib/response');


router.get("/allusers",(req,res)=>{
  Users.find({})
  .then((data)=>res.send(data))
  .catch((err)=>res.send(err))
})
router.post("/registration",(req,res)=>{
  var newuser=new Users()
  Users.findOne({username:req.body.username})
  .then(async(data)=>{
    if(data){
      res.send({status:"User already existed"})
    }
    else{
      newuser.username=req.body.username;
      newuser.password=await bcrypt.hash(req.body.password,10);
      newuser.email=req.body.email;
      newuser.phone=req.body.phone;
      newuser.role=req.body.role;
      // var transporter=nodemailer.createTransport({
      //   service:'gmail',
      //   auth:{
      //     user:"lovelyhackers143@gmail.com",
      //     password:process.env.pass
      //   }
      // })
      // var mailOptions={
      //   from:"lovelyhackers143@gmail.com",
      //   to:`${req.body.email}`,
      //   subject:"Registration successful with ",
      //   text:`Hey ${req.body.username} your registration is successful \n and your password is ${req.body.password}`
      // }
      // transporter.sendMail(mailOptions,function(err,info){
      //   if(err){
      //     console.log(err)
      //   }
      //   else{
      //     console.log("Email send",+info)
      //   }
      // })
      var transporter=nodemailer.createTransport({
          service:'gmail',
          auth:{
            user:"lovelyhackers143@gmail.com",
            pass:process.env.pass
          }
        })

        var mailOptions={
          from:"lovelyhackers143@gmail.com",
          to:`${req.body.email}`,
          subject:"registration successful with your login",
          text:`Hey ${req.body.username} your registration is successful \n and your password is ${req.body.password}`
        }

        transporter.sendMail(mailOptions,function(err,info){
          if(err){
            console.log(err)
          }
          else{
            console.log("email sent "+info)
          }
        })
      newuser.save()
      .then((data)=>res.send({status:"User registration successful"}))
      .catch((err)=>res.send({status:"Something went wrong"}))
    }
  })
})
router.post("/login",(req,res)=>{
  Users.findOne({username:req.body.username})
  .then(async(data)=>{
    if(data){
      if(await bcrypt.compare(req.body.password,data.password)){
        const token=jwt.sign({userid:data._id},process.env.secret,{expiresIn:'1hr'})
        if(data.role=="user"){
        res.send({status:"Login successful",role:"user",id:data._id,token:token})
        }
        else{
          res.send({status:"Login successful",role:"admin",id:data._id,token:token})
        }
      }
      else{
        res.send({status:"username or password incorrect"})
      }
    }
    else{
      res.send({status:"user not found"})
    }
  })
})
router.post('/reset',(req,res)=>{
    Users.findOne({username:req.body.username})
    .then(async (data)=>{
      if(data){
        if(await bcrypt.compare(req.body.password,data.password)){
          
          if(req.body.password==req.body.newpassword){
            
            res.send({status:"passwords are same please enter new password"})
          }
          else{
          const password= await bcrypt.hash(req.body.newpassword,10);
          data.password=password;
          await data.save();
          res.send({status:"update successfuly"})
          }
          
        }else{
          res.send({status:"username or paasword mistake"})
        }
      }else{
        res.send({status:"user not found"})
      }
  })
})
router.delete("/user/:id",(req,res)=>{
  var pid=req.params.id;
  Users.findOneAndDelete(pid)
  .then(()=>res.send({status:"user deleted successfully"}))
  .catch(()=>res.send({status:"something went wrong"}))
})
router.patch("/user/:id",(req,res)=>{
  var pid=req.params.id;
  Users.findOneAndUpdate({_id:pid},{pid,...req.body})
  .then(()=>res.send({status:"user update successfully"}))
  .catch((err)=>res.send({status:"Something went wrong"}))
})


module.exports = router;
