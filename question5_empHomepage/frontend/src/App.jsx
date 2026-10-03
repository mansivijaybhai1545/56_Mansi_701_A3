import {useEffect,useState} from "react";

const API="http://localhost:5000/api";

export default function App(){
 const [page,setPage]=useState("login");
 const [email,setEmail]=useState("");
 const [password,setPassword]=useState("");
 const [profile,setProfile]=useState({});
 const [leaves,setLeaves]=useState([]);
 const [date,setDate]=useState("");
 const [reason,setReason]=useState("");
 const [grant,setGrant]=useState("No");

 const token=localStorage.getItem("token");

 useEffect(()=>{
  if(token){
   setPage("home");
   getProfile();
  }
 },[]);

 async function login(e){
  e.preventDefault();

  const r=await fetch(API+"/auth/login",{
   method:"POST",
   headers:{"Content-Type":"application/json"},
   body:JSON.stringify({email,password})
  });

  const d=await r.json();

  if(d.token){
   localStorage.setItem("token",d.token);
   setPage("home");
   getProfile();
  }else alert(d.msg);
 }

 async function getProfile(){
  const r=await fetch(API+"/employee/profile",{
   headers:{
    Authorization:"Bearer "+localStorage.getItem("token")
   }
  });

  setProfile(await r.json());
 }

 async function getLeaves(){
  const r=await fetch(API+"/leave",{
   headers:{
    Authorization:"Bearer "+localStorage.getItem("token")
   }
  });

  setLeaves(await r.json());
 }

 async function addLeave(e){
  e.preventDefault();

  await fetch(API+"/leave",{
   method:"POST",
   headers:{
    "Content-Type":"application/json",
    Authorization:"Bearer "+token
   },
   body:JSON.stringify({date,reason,grant})
  });

  setDate("");
  setReason("");
  setGrant("No");
  getLeaves();
 }

 function logout(){
  localStorage.removeItem("token");
  setPage("login");
 }

 if(page==="login")
  return <div className="box">
   <h2>Employee Login</h2>

   <form onSubmit={login}>
    <input
     placeholder="Email"
     value={email}
     onChange={e=>setEmail(e.target.value)}
    />

    <input
     type="password"
     placeholder="Password"
     value={password}
     onChange={e=>setPassword(e.target.value)}
    />

    <button>Login</button>
   </form>
  </div>;

 return <div className="box">

  <h2>Employee Home</h2>

  <nav>
   <button onClick={()=>{
    setPage("profile");
    getProfile();
   }}>
    Page 1 - Profile
   </button>

   <button onClick={()=>{
    setPage("leave");
    getLeaves();
   }}>
    Page 2 - Leave
   </button>

   <button onClick={logout}>Logout</button>
  </nav>

  {page==="home"&&
   <h3>Welcome {profile.name}</h3>
  }

  {page==="profile"&&
   <div>
    <h3>Employee Profile</h3>
    <p><b>Name:</b> {profile.name}</p>
    <p><b>Email:</b> {profile.email}</p>
    <p><b>Department:</b> {profile.department}</p>
    <p><b>Phone:</b> {profile.phone}</p>
   </div>
  }

  {page==="leave"&&
   <div>
    <h3>Application for Leave</h3>

    <form onSubmit={addLeave}>
     <input
      type="date"
      value={date}
      onChange={e=>setDate(e.target.value)}
      required
     />

     <input
      placeholder="Reason"
      value={reason}
      onChange={e=>setReason(e.target.value)}
      required
     />

     <select
      value={grant}
      onChange={e=>setGrant(e.target.value)}
     >
      <option>Yes</option>
      <option>No</option>
     </select>

     <button>Add Leave</button>
    </form>

    <h3>Leave List</h3>

    <table>
     <thead>
      <tr>
       <th>Date</th>
       <th>Reason</th>
       <th>Grant</th>
      </tr>
     </thead>

     <tbody>
      {leaves.map(l=>
       <tr key={l._id}>
        <td>{l.date}</td>
        <td>{l.reason}</td>
        <td>{l.grant}</td>
       </tr>
      )}
     </tbody>
    </table>
   </div>
  }

 </div>;
}
