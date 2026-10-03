const mongoose=require("mongoose");

module.exports=mongoose.model("Leave",new mongoose.Schema({
 employee:{type:mongoose.Schema.Types.ObjectId,ref:"Employee"},
 date:String,
 reason:String,
 grant:{type:String,default:"No"}
}));
