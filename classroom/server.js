const express = require("express");
const app = express();
const users = require("./routes/user.js");
const posts = require("./routes/post.js");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("connect-flash");
const path = require("path");

app.set("views",path.join(__dirname,"views")); // This line and the below line are for flash
app.set("view engine", "ejs");

// app.use(cookieParser("secretcode"));

// app.get("/sendSignedCookie", (req, res) => {
//     res.cookie("madeIn", "INDIA", { signed: true });
//     res.send("signed cookie sent");
// });

// app.get("/verify", (req, res) => {
//     res.send("verifying...");
//     console.log(req.cookies); // It will print all the unsigned cookies by default
//     console.log(req.signedCookies); // It will print all the signed cookies. If the value of signed cookie is completely changed external means then it will print '{}' and if some part of the signed cookie is changed it will the value in key-value pair as false
// });
// app.get("/sendCookies", (req, res) => {
//     res.cookie("greet", "Hello"); // cookie() is used to send cookies explicitly by using key and value pairs i.e greet is a key and hello is a value. The value may be a string or object converted to JSON
//     res.cookie("madeIn", "India");
//     res.send("Sent you some cookies");
// });


// app.get("/greet", (req, res) => {
//     let {name = "anonymous"}  = req.cookies;
//     res.send(`Hello ${name}`)
// });
// app.get("/", (req, res) => {
//     res.send("Hi, I am root!");
//     console.log("The cookies of this website are: ");
//     console.log(req.cookies);
// });


// app.use("/users", users); // The meaning of this line is "whatever the routes starting with '/users' are mapped with the users required from user.js"

// app.use("/posts", posts);

const sessionOptions = {// For any route request a signed cookie will be saved in the browser using the secret value as secret code
    secret: "mysupersecretstring",
    resave: false,
    saveUninitialized: true,
};

app.use(session(sessionOptions));
app.use(flash());

app.use((req, res, next) => {
    res.locals.successMsg = req.flash("success"); //res.locals property is used to set variables accessible in templates rendered with 'res.render'.
    res.locals.errorMsg = req.flash("error");
});

app.get("/register", (req, res) => {
    let {name = "anonymous"} = req.query;
    req.session.name = name;
    if(name === "anonymous"){
        req.flash("error","Some ERROR Occured!");
    }
    else{
        req.flash("success", "User registered successfully!"); // flash takes two parameters. They are key-value
    }
    res.redirect("/welcome")
});

app.get("/welcome", (req, res) => {
   res.render("page.ejs", {name: req.session.name}) //flash("success") gives the value of key success.
});

// app.get("/reqcount", (req, res) => {
//     if(req.session.count) { //The condition inside 'if' tells that if 'req.session count' value exists already
//         req.session.count++;
//     }
//     else{
//         req.session.count = 1; //Here count is a new variable we are creating 
//     }
//     res.send(`You sent a request ${req.session.count} times`);
// });

// app.get("/test", (req, res) => {
//     res.send("test successful!");
// });

app.listen(3000, () => {
    console.log("Server is listening on port 3000");
});