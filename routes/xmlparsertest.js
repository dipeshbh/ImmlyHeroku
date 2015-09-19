var express = require('express');
var router = express.Router();
//var gfeed = require('google-feed-api');
var gfeed = require('feed-read-master');
var async = require('async-master');
var acceptsHTML = true;




function retrieveFeedSource(req, res) {
    //console.log("inside retrieveFeedSource function")
    var FeedSource = Parse.Object.extend("FeedSource");
    //console.log("FeedSource");
    var query = new Parse.Query(FeedSource);
    var finalDict = [];
    var queryResults = [{}];
    var count = 0;
    var pageLimit = 10;
    var currentPageCount = 1;
    var totalPages = 1;
    var maxArticles = 100;

    if (req.query.p != null) {
        currentPageCount = req.query.p;
    }

    query.find().then(function(results) {

        queryResults = results;


        async.each(queryResults, function(result,callback) {

            var sourceName = result.get("sourceName");
            var fileURL = result.get("sourceLogo").url();
            var feedURL = result.get("sourceURL");

            //var feed = new gfeed.Feed(feedURL);

            //start XML parsing

            gfeed(feedURL, function(err, articles) {

                //console.log("returning results" + articles.length);


                // loop through the list of articles returned
                for (var x = 0; x < articles.length; x++) {

                    var returnResults = {};
                    var entry = articles[x];

                    returnResults["sourceName"] = sourceName;
                    returnResults["fileURL"] = fileURL;
                    returnResults["title"] = entry.title;
                    returnResults["link"] = entry.link;
                    returnResults["summary"] = entry.content;
                    returnResults["date"] = entry.published;
                    finalDict.push(returnResults);


                }

                callback();

            });



        }, function (err) {
            console.log("error in async function");

            finalDict.sort( function(a,b) {
                    return new Date(b.date) - new Date(a.date)
                }
            );

            if (finalDict.length >maxArticles) {
                finalDict = finalDict.splice(0,maxArticles-1);
            }

            var finalDictLength = finalDict.length;
            totalPages = Math.ceil(finalDictLength/pageLimit);

            var startIndex = (currentPageCount-1)*pageLimit;
            var endIndex = currentPageCount*pageLimit;

            if (finalDict.length <= endIndex) {
                endIndex = finalDict.length - 1;
            }

            if (finalDict.length > startIndex && finalDict.length > endIndex) {
                finalDict = finalDict.slice(startIndex, endIndex);
            }

            var finalJSON = {"Results" : finalDict, "totalPages" : totalPages, "currentPage" : currentPageCount}

            if (!acceptsHTML) {
                res.send(finalJSON);
                acceptsHTML = true;
            } else {
                res.render("hello", {returnResults : finalJSON});
            };


        });

    }, function(error) {
        console.log("Error: " + error.code + " " + error.message);
    });

}


/* GET home page. */
router.get('/', function(req, res, next) {

    if (req.baseUrl == '/ios') {
        acceptsHTML = false;
    }

    //composeTweets(res);
    retrieveFeedSource(req, res);
    //console.log("sourcename is" + newResults[1]["sourceName"]);
});


module.exports = router;


