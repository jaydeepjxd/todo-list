const express = require("express");
const bodyParser = require("body-parser");
const { urlencoded } = require("body-parser");
const date = require(__dirname + "/date.js");

const app = express();
app.use(bodyParser.urlencoded( {extended : true} ));
app.set('view engine', 'ejs');
app.use(express.static("public"));

//global let
let items = [];
let workItems = [];


//get request (root)
app.get("/", function(req, res) {
    let day = date.getDay();
    res.render("index", {listTitle : day, items : items});
});


//post request (root)
app.post("/", function(req, res) {

    if (req.body.list === "Work") {
        console.log(req.body);
        workItems.push(req.body.newItem);
        res.redirect("/work");
    }
    else {
        items.push(req.body.newItem);
        res.redirect("/");
    }

});


//get request (/work)
app.get("/work", function(req, res) {
    res.render("index", {listTitle : "Work List", items : workItems});
});


//get request (/about)
app.get("/about", function(req, res){
    res.render("about");
});

//listen
app.listen(3000, function() {
    console.log("this server is running on port 3000.");
});