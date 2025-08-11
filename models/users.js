var mongoose=require('mongoose');

var userSchema=new mongoose.Schema({
    username:String,
    password:String,
    email:String,
    phone:String
})
module.exports=mongoose.model('users',userSchema)