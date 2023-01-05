const express = require("express");
const bodyParser = require("body-parser");
const { urlencoded } = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash")


const app = express();
app.use(bodyParser.urlencoded( {extended : true} ));
app.set('view engine', 'ejs');
app.use(express.static("public"));


// mongo connect
mongoose.connect("mongodb+srv://admin-jd:test123@cluster0.heuqepe.mongodb.net/todoListDB", {
    useNewUrlParser: true
});


//mongo schema
const itemSchema = new mongoose.Schema({
    name: String,
})
//mongo collection
const Item = mongoose.model("Item", itemSchema)

//creating default list items
const item1 = new Item({ name: "bath"})
const item2 = new Item({ name: "workout"})
const item3 = new Item({ name: "read"})
const defaultItems = [item1, item2, item3]

//list schema
const listSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    items: [itemSchema]
})

const List = mongoose.model("List", listSchema)


//get request (root)
app.get("/", function(req, res) {

    //finding items from db
    Item.find(function (err, items) {
    if (err) { console.log(err);}
    else{
        if(items.length === 0) {  // if db is empty
            // inserting default items
            Item.insertMany(defaultItems).then(function(){
            console.log("Data inserted")  // Success
            }).catch(function(error){
            console.log(error)      // Failure
            }); 
            res.redirect("/")
        }   
        res.render("index", {listTitle : "TODAY", items : items});
    }
    });

});


//get request (custom route)
app.get("/:customListName", function(req, res) {
    const customListName = _.capitalize(req.params.customListName);

    List.findOne({name: customListName}, function(err, foundList){
        if(!err){
            if(!foundList) {  //if no such list exit, create one
                const list = new List({
                    name: customListName,
                    items: defaultItems
                })
                list.save();
                res.redirect("/" + customListName);

            }
            else{
                res.render("index", {listTitle : foundList.name, items : foundList.items});

            }
        }
    })
});



//post request (root)
app.post("/", function(req, res) {
    const newItem = req.body.newItem;
    const listName = req.body.list;

    const item = new Item({name: newItem})

    if(listName === "TODAY") {
        item.save()
        res.redirect("/")
    } else {
        List.findOne({name: listName}, function(err, foundList){
            foundList.items.push(item)
            foundList.save()
            res.redirect("/" + listName)
        })
    }
});

//post request (delete)
app.post("/delete", function(req, res) {
    //storing db id of checked element
    const checkedItemId = req.body.checkBox
    const listName = req.body.listName

    if(listName === "TODAY"){
        Item.findByIdAndDelete(checkedItemId, function(err){
            if (err) {
                console.log(err)
            }
            else{
                res.redirect("/")
            }
        })
    }else {
        List.findOneAndUpdate({name: listName}, 
            {$pull: {items: {_id: checkedItemId}}},
            function(err, foundList){
                if (err) {
                    console.log(err)
                }
                else{
                    res.redirect("/" + listName)
                }
            }
            )
    }


})





//get request (/about)
app.get("/about", function(req, res){
    res.render("about");
});

//listen
app.listen(3000, function() {
    console.log("this server is running on port 3000.");
});