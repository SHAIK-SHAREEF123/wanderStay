const express = require("express");
const router = express.Router({mergeParams: true}); // mergeParams preserves the req.params values from the parent router.
const wrapAsync = require('../utils/wrapAsync.js');
const ExpressError = require('../utils/ExpressError.js');
// const {listingSchema, reviewSchema} = require('../schema.js'); //for server server side validations
const Listing = require("../models/listing.js");
const {isLoggedIn, validateReview, isReviewAuthor} = require("../middleware.js");

const reviewController = require("../controllers/reviews.js")

//Post Review Route
router.post("/",isLoggedIn, validateReview, wrapAsync(reviewController.createReview));

//Delete Review Route
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(reviewController.destroyReview));

module.exports = router;