const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const categories = ["Rooms", "Iconic cities", "Mountains", "Castles", "Amazing pools", "Camping", "Farms", "Arctic", "Boats"]; // Define categories

const assignCategory = (obj) => {
  const { title, description } = obj;

  if (/beach|ocean|coast/i.test(title) || /beach|ocean|coast/i.test(description)) {
    return "Amazing pools";
  } else if (/mountain|hill|peak/i.test(title) || /mountain|hill|peak/i.test(description)) {
    return "Mountains";
  } else if (/castle|palace/i.test(title) || /castle|palace/i.test(description)) {
    return "Castles";
  } else if (/boat|sail|yacht/i.test(title) || /boat|sail|yacht/i.test(description)) {
    return "Boats";
  } else if (/farm|ranch|countryside/i.test(title) || /farm|ranch|countryside/i.test(description)) {
    return "Farms";
  } else if (/camp|tent|adventure/i.test(title) || /camp|tent|adventure/i.test(description)) {
    return "Camping";
  } else if (/arctic|snow|ice/i.test(title) || /arctic|snow|ice/i.test(description)) {
    return "Arctic";
  } else if (/room|suite|stay/i.test(title) || /room|suite|stay/i.test(description)) {
    return "Rooms";
  } else if (/city|urban|downtown/i.test(title) || /city|urban|downtown/i.test(description)) {
    return "Iconic cities";
  }

  // Default to a random category if no match is found
  return categories[Math.floor(Math.random() * categories.length)];
};

const initDB = async () => {
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj) => ({
    ...obj,
    owner: "6757f2372e7b7b5c2edbaa6c", // Adding owner field
    category: assignCategory(obj),  // Assigning category based on title/description
  }));
  await Listing.insertMany(initData.data);
  console.log("Data was initialized with categories based on title/description");
};

initDB();