var express = require('express');
var router = express.Router();
var acceptsHTML = true;



router.get('/', function(req, res, next) {

    var title = req.query.title
    var commentsURL = "http://localhost:3000/comments-"+title
    var finalJSON = {"commentsURL" : commentsURL}
    res.render("comments",{"comments" : finalJSON})
});



module.exports = router;


