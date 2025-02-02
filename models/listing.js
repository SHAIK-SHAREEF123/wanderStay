const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    url: String,
    filename: String,
  },
  price: Number,
  location: String,
  country: String,
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    }
  ],
  owner: {
    type: Schema.Types.ObjectId, //The type used as like this because the one who made a listing must be a valid user
    ref: "User",
  },
  category: {
    type: String,
    enum: ["Rooms", "Iconic cities", "Mountains", "Castles", "Amazing pools", "Camping", "Farms", "Arctic", "Boats"], // Only allow specific categories
  },
});

listingSchema.post("findOneAndDelete", async (listing) => {
  if(listing) {
    await Review.deleteMany({_id: { $in: listing.reviews}}); //To delete all reviews of a listing when it is deleted
  }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;