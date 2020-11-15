require("dotenv").config();
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const md5 = require("md5");

const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect("mongodb://localhost:27017/userDB",
{
  useFindAndModify: false, 
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});


const User = new mongoose.model("User", userSchema);

app.get("/", function(req, res) {
  res.render("home");
});


app.route("/login")
  .get(function(req ,res) {

    res.render("login");

})
  .post(function(req, res) {

    const username = req.body.username;
    const password = md5(req.body.password);

    User.findOne({email: username}, function(err, foundUser) {
      if (err) {
        console.log(err);
      } else {
        if (foundUser) {
          if (foundUser.password === password) {
            res.render("secrets");
          }
        }
      }
    });

  });



app.route("/register")
  .get(function(req, res) {

    res.render("register");

  })
  .post(function(req, res) {

    const newUser = new User({
      email: req.body.username,
      password: md5(req.body.password)
    });
    newUser.save(function(err) {
      if (err) {
        console.log(err);
      } else {
        res.render("secrets");
      }
    });

  });


app.listen(3000, function() {
  console.log("server is up and running");
});