const mongoose=require("mongoose");

module.exports=mongoose.model("Employee",new mongoose.Schema({
 name:String,
 email:{type:String,unique:true},
 password:String,
 department:String,
 phone:String
}));
