const mongoose = require("mongoose");
const sampleData = require("./data.js");

const Listing = require("../models/listing.js");

main().then(() => {
    console.log("Connection Successful");
}).catch(err => {
    console.log(err);
})

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

Listing.insertMany(sampleData.data).then(() => {
    console.log("Data saved");
}).catch((err) => {
    console.log(err);
})