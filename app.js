require("dotenv").config();
const express = require("express");
const https = require("https");
const ejs = require("ejs");
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passport = require("passport");
const session = require("express-session");
const passportLocalMongoose = require("passport-local-mongoose");
const findOrCreate = require("mongoose-find-or-create");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

// Mongoose

mongoose.set("strictQuery", false);
mongoose.connect(
  `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_KEY}@cluster0.gv3eye4.mongodb.net/FacialReco?retryWrites=true&w=majority`
);

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

/// Session

app.use(
  session({
    secret: "Hackathon",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

///// User Schema ///

const userSchema = new mongoose.Schema({
    name:String,
    username: String,
    password: String,
});


userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

const User = new mongoose.model("User", userSchema);

passport.use(User.createStrategy());

passport.serializeUser(function (user, cb) {
  process.nextTick(function () {
    cb(null, { id: user.id, username: user.username, name: user.name });
  });
});

passport.deserializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, user);
  });
});

/////// Student Schema /////////
const studentSchema = new mongoose.Schema({
  name:String,
  ID: String,
});
const Student = new mongoose.model("Student", studentSchema);



/////// Present Schema /////////
const presentSchema = new mongoose.Schema({
  name:String,
  ID: String,
  isPresent: Boolean,
});
const Present = new mongoose.model("Present", presentSchema);







/////// HOME ROUTE /////
app.get("/", (req, res) => {
  // res.sendFile(__dirname+"/wavyPage/projects.html")
  res.render("frontpage");
});

/////// Login /////
// app.get("/login", (req, res) => {
//   // res.sendFile(__dirname+"/wavyPage/projects.html")
//   res.render("login");
// });

/////// Student  /////
app.get("/student", (req, res) => {
  // res.sendFile(__dirname+"/wavyPage/projects.html")
  res.render("dash");
});


////////  LOGIN //////////////
app
  .route("/login")
  .get(function (req, res) {
    res.render("login");
  })

  .post(function (req, res) {
    const user = new User({
      username: req.body.username,
      password: req.body.password,
    });
    req.login(user, function (err) {
      if (err) {
        console.log(err);
        res.redirect("/login");
      } else {
        passport.authenticate("local")(req,res,function(){
          res.redirect("/faculty");
        });
      }
    });
  });


////////  REGISTER //////////////
app
  .route("/register")
  .get(function (req, res) {
    res.render("register");
  })

  .post(function (req, res) {
    User.register(
      { username: req.body.username },
      req.body.password,
      function (err, user) {
        if (err) {
          console.log(err);
          res.redirect("/register");
        } else {
          passport.authenticate("local")(req, res, function () {
            res.redirect("/secrets");
          });
        }
      }
    );
  });




  ////////  Faculty //////////////
app
.route("/faculty")
.post((req,res)=>{
  

})


////////  LOGOUT //////////////
app.route("/logout").get(function(req,res){
    req.logout(function(err){
      if(!err){
  
        res.redirect("/");
      }
    });
  })




//Listen Section
const PORT = process.env.PORT;
app.listen(PORT, function () {
  console.log(`Server On ${PORT}`);
});
