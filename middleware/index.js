// all middleware goes here
var Comment = require("../models/comment");
var Campground = require("../models/campground");
var middlewareObj = {};


middlewareObj.checkCampgroundOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
            req.flash("error", "Database Error: Campground Not Found");
            res.redirect("back");
        } else {
            if(campground.author.id.equals(req.user._id)){
                next();
            } else {
                 req.flash("error", "You are not authorized to do that!")
                 res.redirect("back");
            }
        }
});
    } else {
        req.flash("error", "You must be logged in to do that!")
        res.redirect("back");
    }
}

middlewareObj.checkCommentOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, comment){
        if(err){
            console.log(err);
            res.redirect("back");
        } else {
            if(comment.author.id.equals(req.user._id)){
                next();
            } else {
                req.flash("error", "Permission Denied")
                 res.redirect("back");
            }
    }
    });
        } else {
            req.flash("error", "You must be logged in to do that")
            res.redirect("back");
        }
    };

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You must be logged in to do that!")
    res.redirect("/login");
};

module.exports = middlewareObj;