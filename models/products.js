var mongoose=require('mongoose');

var productSchema=new mongoose.Schema({
    productName:String,
    productDescription:String,
    productPrice:String,
    producttCategory:String,
    productImage:String
})
module.exports=mongoose.model('products',productSchema)