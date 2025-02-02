if(process.env.NODE_ENV!="production"){ //dotenv will be used only in development phase but not in productin phase so whenver we deploy our project we set NODE_ENV varible value as production.dotevn contains credentials
    require('dotenv').config() //Dotenv is a zero-dependency module that loads environment variables from a .env file into process.env
}


const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Listing = require("./models/listing.js");
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const wrapAsync = require('./utils/wrapAsync.js');
const ExpressError = require('./utils/ExpressError.js');
const {listingSchema, reviewSchema} = require('./schema.js'); //for server server side validations
const session = require("express-session");
const flash = require("connect-flash");
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require("./models/user.js");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
    .then(() => {
        console.log("Connected to DB");
    })
    .catch((err) => {
        console.log(err);
    });

async function main() {
    await mongoose.connect(MONGO_URL);
}

app.set("views",path.join(__dirname,"views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const sessionOptions = {
    secret: "mysupersecretcode",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // This means that the cookie will expire after 7 days form now data and time...It is represented in milliseconds
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true, //It is true by default
    },
};

// app.get("/",(req,res) => {
//     res.send("Hi! I'm root");
// });

app.use(session(sessionOptions));
app.use(flash());

//The below two lines are commonly write always and belongs to passport middleware
app.use(passport.initialize()); //It is a middleware that initializes passport. we have to write after session like above
app.use(passport.session()); //A web application needs the ability to identify user as they browse from page to page. This series of request and responses, each associated with the same user, is known as session.
passport.use(new LocalStrategy(User.authenticate()));

//The below two lines belongs to the passport-local-mongoose for managing user sessions
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    // console.log(res.locals.success);
    next();
});

// app.get("/demouser", async  (req, res) => {
//     let fakeUser = new User({
//         email: "student@gmail.com",
//         username: "delta-student",
//     });

//     let registeredUser = await User.register(fakeUser, "helloworld"); //register(user, password, callback),Convenience method to register a new user instance with a given password. Checks if username is unique.
//     res.send(registeredUser);
//     console.log(registeredUser);
// });
app.get("/", listingRouter);

app.use("/listings", listingRouter); //whenever we get /listings in browser then we go to listings required from routes folder

app.use("/listings/:id/reviews", reviewRouter); // //whenever we get /listings/:id/reviews in browser then we go to listings required from routes folder
app.use("/",userRouter); 

// app.get("/testListing", async(req,res) => {
//     let sampleListing = new Listing({
//         title: "My New Villa",
//         description: "By the beach",
//         price: 12000,
//         location: "Calangute, Goa",
//         country: "India",
//     });
//     await sampleListing.save();
//     console.log("Sample was saved successfully!");
//     res.send("Successfull Testing");
// });

app.all("*", (req, res, next) => { // It will be executed for all the routes which doesn't exist or  not created till now
    next(new ExpressError(404, "Page Not Found!"));
});

app.use((err, req, res, next) => {
    let {statusCode=500, message="Something Went Wrong!"} = err; 
    // res.status(statusCode).send(message);
    res.status(statusCode).render("error.ejs", {message});
});

app.listen(8000,() => {
    console.log("Server is listening on port 8000");
});

