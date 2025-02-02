const Listing = require("./models/listing");
const Review = require("./models/review");
const {reviewSchema} = require("./schema.js");

module.exports.isLoggedIn = (req, res, next) => {
    // console.log(req.user); //req object stores huge amount of info, you case see by console req object
    if(!req.isAuthenticated()) { //redirectUrl is variable we define for session
        req.session.redirectUrl = req.originalUrl; // originalUrl is present in req object, it defines the overall path we want to reach
        req.flash("error", "You must be logged in to add listing");
        return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectUrl = (req, res, next) => { // It is used because the session will be deleted after login so its variables are also deleted.
    if(req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};


module.exports.validateReview  = (req, res, next) => {
    let {error} = reviewSchema.validate(req.body);
    console.log(req.body);
    console.log(error);
    if(error) {
        let {errMsg} = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }
    else{
        next();
    }
}

module.exports.isReviewAuthor = async(req,res,next) => {
    let {id, reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)) {
        req.flash("error", "You are not the author of this review");
        return res.redirect(`/listings/${id}`);
    }
    next();
}