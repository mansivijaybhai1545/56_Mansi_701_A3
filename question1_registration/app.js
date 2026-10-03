const express=require("express"),path=require("path"),fs=require("fs"),multer=require("multer");
const {body,validationResult}=require("express-validator"),app=express(),PORT=3000;
const profile=path.join(__dirname,"public/uploads/profile"),others=path.join(__dirname,"public/uploads/others");
fs.mkdirSync(profile,{recursive:true});fs.mkdirSync(others,{recursive:true});

app.set("view engine","ejs");app.use(express.urlencoded({extended:true}));app.use(express.static(path.join(__dirname,"public")));

const filter=(req,file,cb)=>["image/jpeg","image/jpg","image/png","image/gif"].includes(file.mimetype)?cb(null,true):cb(new Error("Only JPG, JPEG, PNG and GIF images are allowed."));
const storage=multer.diskStorage({
 destination:(req,file,cb)=>cb(null,file.fieldname==="profilePic"?profile:file.fieldname==="otherPics"?others:null),
 filename:(req,file,cb)=>cb(null,Date.now()+"-"+Math.round(Math.random()*1E9)+path.extname(file.originalname))
});
const upload=multer({storage,fileFilter:filter,limits:{fileSize:2*1024*1024,files:6}});

app.get("/",(req,res)=>res.render("register",{errors:[],oldData:{},uploadError:null}));

app.post("/register",(req,res,next)=>upload.fields([{name:"profilePic",maxCount:1},{name:"otherPics",maxCount:5}])(req,res,e=>e?res.render("register",{errors:[],oldData:req.body||{},uploadError:e.message}):next()),[
 body("username").trim().notEmpty().withMessage("Username is required.").isLength({min:3,max:20}).withMessage("Username must be 3-20 characters.").matches(/^[a-zA-Z0-9_]+$/).withMessage("Username can contain only letters, numbers and underscore."),
 body("password").notEmpty().withMessage("Password is required.").isLength({min:6}).withMessage("Password must contain at least 6 characters."),
 body("confirmPassword").notEmpty().withMessage("Please confirm your password.").custom((v,{req})=>v===req.body.password).withMessage("Passwords do not match."),
 body("email").trim().notEmpty().withMessage("Email is required.").isEmail().withMessage("Please enter a valid email address."),
 body("gender").notEmpty().withMessage("Please select your gender."),
 body("hobbies").custom(v=>{if(!v)throw new Error("Please select at least one hobby.");return true})
],(req,res)=>{
 const errors=validationResult(req);if(!errors.isEmpty())return res.render("register",{errors:errors.array(),oldData:req.body,uploadError:null});
 const pic=f=>({originalName:f.originalname,filename:f.filename,path:"/uploads/"+(f.fieldname==="profilePic"?"profile/":"others/")+f.filename});
 const userData={...req.body,hobbies:Array.isArray(req.body.hobbies)?req.body.hobbies:[req.body.hobbies],profilePic:req.files.profilePic?pic(req.files.profilePic[0]):null,otherPics:(req.files.otherPics||[]).map(pic)};
 res.render("result",{userData});
});

app.get("/download/:folder/:filename",(req,res)=>{
 const {folder,filename}=req.params;
 if(!["profile","others"].includes(folder)||filename.includes("..")||filename.includes("/")||filename.includes("\\"))return res.status(400).send("Invalid file.");
 res.download(path.join(__dirname,"public/uploads",folder,filename),filename);
});

app.use((err,req,res,next)=>res.status(500).send("Something went wrong while processing the request."));
app.listen(PORT,()=>console.log(`Server running at http://localhost:${PORT}`));