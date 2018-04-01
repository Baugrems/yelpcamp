var express = require("express");
var router = express.Router(),
    mongoose                    = require("mongoose"),
    passport                    = require("passport"),
    LocalStrategy               = require("passport-local"),
    passportLocalMongoose       = require("passport-local-mongoose");
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var User = require("../models/user");
var middleware = require("../middleware/");

router.get("/", function(req, res){
    res.render("landing");
});




//====================================================================
// AUTH ROUTES

router.get("/register", function(req, res){
   res.render("register"); 
});

router.post("/register", function(req, res){
   User.register(new User({username: req.body.username}), req.body.password, function(err, user){
      if(err){
          console.log(err);
          req.flash("error", err.message);
          res.redirect('/register');
      } else {
          passport.authenticate("local")(req, res, function(){
                req.flash("success", "Registration Successful: " + user.username);
                res.redirect("/campgrounds");
          });
      }
   });
});

router.get("/login", function(req, res){
   res.render("login"); 
});

router.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}),    function(req, res){
});

router.get("/logout", function(req, res){
   req.logout();
   req.flash("success", "Logged you out!");
   res.redirect("/");
});


module.exports = router;