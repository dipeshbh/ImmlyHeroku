var express = require('express');
var router = express.Router();


function getBulletin(res){

    var Bulletin = Parse.Object.extend("Bulletin");
    //console.log("FeedSource");
    var query = new Parse.Query(Bulletin);
    var finalDict = [];
    var queryResults = [{}];
    var count = 0;

    query.find().then(function(results) {

        for(var i=0; i < results.length; i++){
            queryResults[i] = {};
            queryResults[i]["BulletinDate"] = results[i].get("BulletinDate").toString().substr(0,15);
            queryResults[i]["EB"] = results[i].get("EB");
            queryResults[i]["INCutoffDate"] = results[i].get("INCutoffDate");
            queryResults[i]["CNCutoffDate"] = results[i].get("CNCutoffDate");
            queryResults[i]["MXCutoffDate"] = results[i].get("MXCutoffDate");
            queryResults[i]["PHCutoffDate"] = results[i].get("PHCutoffDate");
            queryResults.push(queryResults[i]);
        }

        res.render("track",{results : queryResults});

    },function(error) {
        console.log("Error: " + error.code + " " + error.message);
    });
}


/* GET home page. */
router.get('/', function(req, res, next) {
    getBulletin(res);
    //res.render('track',{returnResults : [{}]});
});



module.exports = router;


