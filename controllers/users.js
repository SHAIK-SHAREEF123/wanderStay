const User = require("../models/user.js"); 
module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup.ejs");
};

module.exports.signup = async(req, res) => {
    try{
        let {username, email, password} = req.body;
        const newUser = await new User({email, username});
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        req.login(registeredUser, (err) => {
            if(err) {
                return next(err);
            }
            req.flash("success", "Welcome to Wanderlust");
            res.redirect("/listings");
        });
           
    } catch(err) {
        req.flash("error", err.message);
        res.redirect("/signup");
    }
};

module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs");
};

module.exports.login = async(req, res) => {
    req.flash("success","Welcome back, You are logged in.");
    let redirectUrl = res.locals.redirectUrl || "/listings"; // If any one of them is not empty then it will asign to left side variable, both can't be not empty.
    res.redirect(redirectUrl);  
};

module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if(err){
           return next();
        }
        req.flash("success","You are logged out!");
        res.redirect("/listings");
    });
};

