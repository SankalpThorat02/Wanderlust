const express = require("express");
const app = express();

const mongoose = require("mongoose");
const methodOverride = require("method-override");
const path = require("path");

const Listing = require("./models/listing.js");

const port = 8080;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({extended: true}));
app.use(express.json());

main().then(() => console.log("Connection Successful"))
    .catch(err => console.log(err));

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

app.listen(port, () => {
    console.log(`App is listening at port ${port}`);
})

app.get('/', (req, res) => {
    res.send("hello");
})

//Index Route 
app.get('/listings', async (req, res) => {
    const allListings = await Listing.find();
    res.render("listings/index.ejs", {allListings});
})


//New Route 
app.get('/listings/new', (req, res) => {
    res.render("listings/new.ejs");
})

//Create Route
app.post('/listings', async (req, res) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save(); 

    res.redirect('/listings');
})

//Show Route 
app.get('/listings/:id', async (req, res) => {
    const {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", {listing});
})