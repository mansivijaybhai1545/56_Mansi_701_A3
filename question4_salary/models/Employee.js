const mongoose=require("mongoose");

const s=new mongoose.Schema({
 empid:String,name:String,email:String,department:String,
 basic:Number,hra:Number,da:Number,deduction:Number,salary:Number,password:String
});

s.pre("save",function(){
 this.salary=this.basic+this.hra+this.da-this.deduction;
});

module.exports=mongoose.model("Employee",s);
