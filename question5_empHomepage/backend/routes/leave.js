const router=require("express").Router();
const jwt=require("jsonwebtoken");
const Leave=require("../models/Leave");

function auth(req,res,next){
 try{
  req.id=jwt.verify(
   req.headers.authorization.split(" ")[1],
   process.env.JWT_SECRET
  ).id;
  next();
 }catch(e){
  res.status(401).json({msg:"Unauthorized"});
 }
}

router.post("/",auth,async(req,res)=>{
 res.json(await Leave.create({
  ...req.body,
  employee:req.id
 }));
});

router.get("/",auth,async(req,res)=>{
 res.json(await Leave.find({employee:req.id}));
});

module.exports=router;
