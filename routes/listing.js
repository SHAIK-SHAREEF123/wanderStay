// This file is for restructuring listings
const express = require("express");
const router = express.Router(); // Express Routers are a way to organize your Express application such that our primary app.js file does not become bloated
const wrapAsync = require('../utils/wrapAsync.js');
const {listingSchema, reviewSchema} = require('../schema.js'); //for server server side validations
const ExpressError = require('../utils/ExpressError.js');
const Listing = require("../models/listing.js");
const {isLoggedIn} = require("../middleware.js");
const listingController = require("../controllers/listings.js"); 
const multer  = require('multer'); //used for uploading files from form 
const {storage} = require("../cloudConfig.js")
const upload = multer({storage}); // dest is to define the where the uploaded files will be store

const validateListing  = (req, res, next) => {
    let {error} = listingSchema.validate(req.body);
    if(error) {
        let {errMsg} = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }
    else{
        next();
    }
}

router
    .route("/")
    .get(wrapAsync(listingController.index)) //Index Route
    .post(isLoggedIn, upload.single('listing[image]'), validateListing, wrapAsync(listingController.createListing)); 
    //Create Route

//New Route
router.get("/new", isLoggedIn, listingController.renderNewForm);

router
    .route("/:id")
    .get(wrapAsync(listingController.showListing)) //Show Route
    .put(isLoggedIn, upload.single('listing[image]'), validateListing, wrapAsync(listingController.updateListing)) //Update Route
    .delete(isLoggedIn, wrapAsync(listingController.destroyListing)); 
    //Delete Route

//Edit Route
router.get("/:id/edit", isLoggedIn, wrapAsync(listingController.renderEditForm));

module.exports = router;