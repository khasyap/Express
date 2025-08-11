var express = require('express');
var router = express.Router();
var bcrypt=require('bcryptjs')
var Users=require('../models/users');
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
        res.send({status:"Login successful",data:data})
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
