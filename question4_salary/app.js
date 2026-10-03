require("dotenv").config();
const express=require("express"),mongoose=require("mongoose"),session=require("express-session"),bcrypt=require("bcrypt"),Employee=require("./models/Employee");
const app=express();
app.set("view engine","ejs");app.use(express.urlencoded({extended:true}));app.use(express.static("public"));
app.use(session({secret:"erp123",resave:false,saveUninitialized:false}));
mongoose.connect(process.env.MONGO).then(()=>console.log("MongoDB connected"));

const auth=(req,res,next)=>req.session.admin?next():res.redirect("/");
app.get("/",(req,res)=>res.render("login"));
app.post("/login",(req,res)=>req.body.user=="admin"&&req.body.pass=="admin123"?(req.session.admin=1,res.redirect("/dashboard")):res.send("Invalid Login <a href='/'>Try again</a>"));

app.get("/dashboard",auth,async(req,res)=>res.render("dashboard",{emps:await Employee.find()}));

app.post("/add",auth,async(req,res)=>{
 const p=Math.random().toString(36).slice(-8),empid="EMP"+Date.now().toString().slice(-5);
 const e=await Employee.create({...req.body,empid,password:await bcrypt.hash(p,10)});
 console.log(`EMAIL SENT TO ${e.email}: Employee ID=${empid}, Password=${p}`);
 res.redirect("/dashboard");
});

app.get("/delete/:id",auth,async(req,res)=>{await Employee.findByIdAndDelete(req.params.id);res.redirect("/dashboard")});
app.get("/logout",(req,res)=>req.session.destroy(()=>res.redirect("/")));
app.listen(3000,()=>console.log("http://localhost:3000"));
