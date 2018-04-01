var express                     = require("express"),
    bodyParser                  = require("body-parser"),
    flash                       = require("connect-flash"),
    mongoose                    = require("mongoose"),
    Campground                  = require("./models/campground"),
    seedDB                      = require("./seeds"),
    Comment                     = require("./models/comment"),
    passport                    = require("passport"),
    LocalStrategy               = require("passport-local"),
    passportLocalMongoose       = require("passport-local-mongoose"),
    methodOverride              = require("method-override"),
    User                        = require("./models/user");
    

var app = express();
var campgroundRoutes    = require("./routes/campgrounds");
var commentRoutes       = require("./routes/comments");
var indexRoutes          = require("./routes/index");


//seedDB(); //SEED Database
mongoose.connect(process.env.DATABASEURL);
//mongoose.connect("mongodb://localhost/yelp_camp");
//mongoose.connect("mongodb://chewie:han@ds131329.mlab.com:31329/yelpcampbaugrems");


app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.use(flash());

app.use(require("express-session")({
    secret: "Chewbacca is the best dog in the entire world!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
   res.locals.currentUser = req.user;
   next();
});



app.use(indexRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/campgrounds", campgroundRoutes);

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("YelpCamp Server has started");
});

