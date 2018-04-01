var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware/");

router.get("/", function(req, res){
    Campground.find({}, function(err, campgrounds){
        if(err){
            console.log(err);
        } else {
            res.render("campgrounds/index", {campgrounds: campgrounds, currentUser: req.user});    
        }
    });
});

router.post("/", middleware.isLoggedIn, function(req, res){
    var name = req.body.name;
    var price = req.body.price;
    var image = req.body.image;
    var description = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newCampground = {name: name, price: price, image: image, description: description, author: author};
    Campground.create(newCampground, function(err, newlyCreatedCampground){
        if(err){
            console.log(err);
        } else {
            res.redirect("/campgrounds");
        }
    });
});

router.get("/new", middleware.isLoggedIn, function(req, res){
   res.render("campgrounds/new"); 
});

router.get("/:id", function(req, res){
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
       if(err){
           req.flash("error", err.message);
           res.redirect("back");
       } else { 
            res.render("campgrounds/show", {campground: foundCampground});
       }
    });
});

//EDIT ROUTE
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
        Campground.findById(req.params.id, function(err, campground){
            if(err){
                req.flash("error", err.message);
                res.redirect("back");
            } else {
                res.render("campgrounds/edit", {campground: campground});
            }
    });
});

//UPDATE ROUTE
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if(err){
            res.redirect("/campgrounds");
        } else {
            req.flash("success", "Campground Updated Successfully!")
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

//DELETE ROUTE
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/campgrounds");
        } else {
            req.flash("success", "Campground Deleted Successfully")
            res.redirect("/campgrounds");
        }
    });
});



module.exports = router;