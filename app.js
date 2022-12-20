const express = require("express");
const bodyParser = require("body-parser");
const { urlencoded } = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded( {extended : true} ));
app.set('view engine', 'ejs');
app.use(express.static("public"));

//global var
var items = [];


//get request (root)
app.get("/", function(req, res) {
    options = {
        weekday : "long",
        day : "numeric",
        month : "long"
    }
    var today = new Date();
    var day = today.toLocaleDateString("en-us", options);


    res.render("index", {day : day, items : items});
});


//post request (root)
app.post("/", function(req, res) {

    console.log(req.body.newItem);
    items.push(req.body.newItem);

    res.redirect("/");
});

//listen
app.listen(3000, function() {
    console.log("this server is running on port 3000.");
});