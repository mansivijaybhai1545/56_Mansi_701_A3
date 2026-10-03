const mongoose=require("mongoose");
const bcrypt=require("bcryptjs");
require("dotenv").config();

const Employee=require("./models/Employee");

mongoose.connect(process.env.MONGO_URI).then(async()=>{
 await Employee.deleteMany({email:"john@gmail.com"});

 await Employee.create({
  name:"Mansi",
  email:"mansi@gmail.com",
  password:await bcrypt.hash("1234",10),
  department:"IT",
  phone:"9876543210"
 });

 console.log("Employee created");
 process.exit();
});
