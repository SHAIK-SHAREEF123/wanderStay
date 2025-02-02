const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

module.exports.createReview = async(req, res) => { // Here '/' means '/listings/:id/reviews'
    try{
        let listing = await Listing.findById(req.params.id)
        
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    // console.log(newReview);

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    req.flash("success", "New Review Created!");
    // res.send("New Review Saved");
    res.redirect(`/listings/${listing.id}`);
    }catch(err){
        console.log(err);
    }
};

module.exports.destroyReview = async (req, res) => {
    let {id, reviewId} = req.params;
    // The below line is to remove the review from the reviews array of a listing
    await Listing.findByIdAndUpdate(id, {$pull: {reviews:reviewId}}); //The $pull operator removes all instances of a value or values that match a specified condition from an existing array
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review Deleted");
    res.redirect(`/listings/${id}`);
};