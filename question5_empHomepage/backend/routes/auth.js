const router=require("express").Router();
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");
const Employee=require("../models/Employee");

router.post("/login",async(req,res)=>{
 const {email,password}=req.body;
 const e=await Employee.findOne({email});
 if(!e||!(await bcrypt.compare(password,e.password)))
  return res.status(401).json({msg:"Invalid login"});
 res.json({token:jwt.sign({id:e._id},process.env.JWT_SECRET)});
});

module.exports=router;

