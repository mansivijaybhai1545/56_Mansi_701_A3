const router=require("express").Router();
const jwt=require("jsonwebtoken");
const Employee=require("../models/Employee");

router.get("/profile",async(req,res)=>{
 try{
  const id=jwt.verify(
   req.headers.authorization.split(" ")[1],
   process.env.JWT_SECRET
  ).id;

  res.json(await Employee.findById(id).select("-password"));
 }catch(e){
  res.status(401).json({msg:"Unauthorized"});
 }
});

module.exports=router;
