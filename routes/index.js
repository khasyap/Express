var express = require('express');
var router = express.Router();
var Products=require('../models/products')

router.get("/products",(req,res)=>{
  Products.find()
  .then((data)=>res.send(data))
  .catch((err)=>console.log(err))
})
router.post("/addproducts",(req,res)=>{
  var newproducts=new Products(req.body);
  newproducts.save()
  .then(()=>res.send({status:"Product added successfully"}))
  .catch(()=>res.send({status:"Something went wrong"}))
})
router.delete("/products/:id",(req,res)=>{
  var pid=req.params.id
  Products.findOneAndDelete(pid)
  .then(()=>res.send({status:"Product deleted successfully"}))
  .catch(()=>res.send({status:"Something went wrong"}))
})
router.patch("/products/:id",(req,res)=>{
  var pid=req.params.id
  Products.findOneAndUpdate({_id:pid},{pid,...req.body})
  .then(()=>res.send({status:"Product updated successfully"}))
  .catch(()=>res.send({status:"Something went wrong"}))
})
router.put("/products/:id",(req,res)=>{
  var pid=req.params.id
  Products.findOneAndReplace({_id:pid},req.body)
  .then(()=>res.send({status:"Product updated successfully"}))
  .catch(()=>res.send({status:"Something went wrong"}))
})
router.post("/addMany", (req, res) => {
  Products.insertMany(req.body)
  .then(()=>res.send({status:"Product added successfully"}))
  .catch(()=>res.send({status:"Something went wrong"}))
})
router.get("/greaterthan",(req,res)=>{
  var price=req.query.price;
  Products.find({productPrice:{$gte:price}})
  .then((data)=>res.send(data))
  .catch(()=>res.send({status:"Something went wrong"}))
})
router.get("/lessthan",(req,res)=>{
  var price=req.query.price;
  Products.find({productPrice:{$lte:price}})
  .then((data)=>res.send(data))
  .catch(()=>res.send({status:"Something went wrong"}))
})
router.get("/sort",(req,res)=>{
  var{orderby,order}=req.query;
  var sortObj={[orderby]:order=="asc"?1:-1}
  Products.find({}).sort(sortObj)
  .then((data)=>res.send(data))
  .catch(()=>res.send({status:"Something went wrong"}))
})
router.get("/paging",(req,res)=>{
  var {page,limit}=req.query;
  var skip=(page-1)*limit;
  Products.find({}).skip(skip).limit(limit)
  .then((data)=>res.send(data))
  .catch(()=>res.send({status:"Something went wrong"}))
})
module.exports = router;
