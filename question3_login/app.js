const express = require("express");
const session = require("express-session");
const { createClient } = require("redis");
const { RedisStore } = require("connect-redis");

const app = express();
const redis = createClient();
redis.connect();

app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));
app.use(session({
  store: new RedisStore({ client: redis }),
  secret: "secret123",
  resave: false,
  saveUninitialized: false
}));

const auth = (req, res, next) =>
  req.session.user ? next() : res.redirect("/");

app.get("/", (req, res) => res.send(`
  <link rel="stylesheet" href="/style.css">
  <div class="box">
    <h2>Login</h2>
    <form method="post" action="/login">
      <input name="username" placeholder="Username" required>
      <input name="password" type="password" placeholder="Password" required>
      <button>Login</button>
    </form>
  </div>
`));

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (username === "admin" && password === "1234") {
    req.session.user = username;
    return res.redirect("/dashboard");
  }
  res.send("Invalid login. <a href='/'>Try again</a>");
});

app.get("/dashboard", auth, (req, res) =>
  res.send(`<h2>Dashboard</h2><p>Welcome ${req.session.user}</p>
  <a href="/profile">Protected Route 2</a> | <a href="/logout">Logout</a>`)
);

app.get("/profile", auth, (req, res) =>
  res.send(`<h2>Profile</h2><p>This is a protected route.</p>
  <a href="/dashboard">Dashboard</a> | <a href="/logout">Logout</a>`)
);

app.get("/logout", (req, res) =>
  req.session.destroy(() => res.redirect("/"))
);

app.listen(3000, () => console.log("http://localhost:3000"));
