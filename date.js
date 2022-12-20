exports.getDate = function() {
    options = {
        weekday : "long",
        day : "numeric",
        month : "long"
    }
    let today = new Date();
    return today.toLocaleDateString("en-us", options);
 
}
exports.getDay = function() {
    options = {
        weekday : "long",
    }
    let today = new Date();
    return today.toLocaleDateString("en-us", options);
 
}