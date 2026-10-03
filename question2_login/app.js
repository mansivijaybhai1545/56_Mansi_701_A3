const express=require("express"),path=require("path"),fs=require("fs"),session=require("express-session"),FileStore=require("session-file-store")(session);
const app=express(),PORT=3000,dataPath=path.join(__dirname,"data"),sessionsPath=path.join(__dirname,"sessions");
fs.mkdirSync(dataPath,{recursive:true});fs.mkdirSync(sessionsPath,{recursive:true});

const usersFile=path.join(dataPath,"users.json");
if(!fs.existsSync(usersFile))fs.writeFileSync(usersFile,JSON.stringify([
{id:1,username:"admin",password:"admin@123",name:"Administrator",email:"admin@example.com"},
{id:2,username:"student",password:"student@123",name:"Student User",email:"student@example.com"}],null,2));

app.set("view engine","ejs");app.use(express.urlencoded({extended:true}));app.use(express.static(path.join(__dirname,"public")));
app.use(session({store:new FileStore({path:sessionsPath,logFn:()=>{}}),secret:"question2_login_secret_2026",resave:false,saveUninitialized:false,cookie:{maxAge:3600000,httpOnly:true,secure:false}}));

const getUsers=()=>JSON.parse(fs.readFileSync(usersFile,"utf8"));
const auth=(req,res,next)=>req.session.user?next():res.redirect("/login");

app.get("/",(req,res)=>res.redirect(req.session.user?"/dashboard":"/login"));
app.get("/login",(req,res)=>req.session.user?res.redirect("/dashboard"):res.render("login",{error:null}));

app.post("/login",(req,res)=>{
 const {username="",password=""}=req.body;
 if(!username.trim()||!password)return res.render("login",{error:"Username and password are required."});
 const user=getUsers().find(u=>u.username===username.trim()&&u.password===password);
 if(!user)return res.render("login",{error:"Invalid username or password."});
 req.session.user={id:user.id,username:user.username,name:user.name,email:user.email};
 req.session.save(err=>err?res.status(500).send("Unable to create session."):res.redirect("/dashboard"));
});

app.get("/dashboard",auth,(req,res)=>res.render("dashboard",{user:req.session.user}));
app.get("/profile",auth,(req,res)=>res.render("profile",{user:req.session.user}));
app.get("/logout",(req,res)=>req.session.destroy(()=>{res.clearCookie("connect.sid");res.redirect("/login")}));
app.use((req,res)=>res.status(404).render("unauthorized"));
app.use((err,req,res,next)=>res.status(500).send("Something went wrong."));
app.listen(PORT,()=>console.log(`Server running at http://localhost:${PORT}`));