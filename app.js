const express = require("express");
const app = express();

const mongoose = require("mongoose");
const methodOverride = require("method-override");
const path = require("path");
const ejsMate = require("ejs-mate");

const Listing = require("./models/listing.js");
const ExpressError = require("./utility/ExpressError.js");
const { listingSchema } = require("./schema.js");

const port = 8080;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);

app.use(express.static(path.join(__dirname, "public")));

const validateListing = (req, res, next) => {
    let {error} = listingSchema.validate(req.body);
    if(error) {
        throw new ExpressError(400, error);
    }
    else {
        next();
    }
};

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
app.post('/listings', validateListing, async (req, res) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save(); 

    res.redirect('/listings');
})

//Show Route 
app.get('/listings/:id', async (req, res) => {
    const {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing) {
        throw new ExpressError(404, "Listing not found");
    }
    res.render("listings/show.ejs", {listing});
})

//Edit Route 
app.get('/listings/:id/edit', async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing) {
        throw new ExpressError(404, "Listing Not found");
    }
    res.render("listings/edit.ejs", {listing});
})

//Update Route
app.put('/listings/:id', validateListing, async (req, res) => {
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, req.body.listing);
    res.redirect(`/listings/${id}`);
})

//Delete Route 
app.delete('/listings/:id', async (req, res) => {
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect('/listings');
})

app.use((req, res, next) => {
    throw new ExpressError(404, "Page Not Found");
})

app.use((err, req, res, next) => {
    let {status = 500, message = "Some error"} = err;
    res.status(status).render("listings/error.ejs", {err});
})