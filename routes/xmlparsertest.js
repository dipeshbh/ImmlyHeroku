var express = require('express');
var router = express.Router();
//var gfeed = require('google-feed-api');
var gfeed = require('feed-read-master');
var async = require('async-master');
var Twit = require('twit');




function retrieveFeedSource(req, res) {
    //console.log("inside retrieveFeedSource function")
    var FeedSource = Parse.Object.extend("FeedSource");
    //console.log("FeedSource");
    var query = new Parse.Query(FeedSource);
    var finalDict = [];
    var queryResults = [{}];
    var count = 0;
    var pageLimit = 20;
    var currentPageCount = 1;
    var totalPages = 1;

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
                    returnResults["summary"] = entry.contentSnippet;
                    returnResults["date"] = entry.publishedDate;
                    finalDict.push(returnResults);


                }

                callback();

            });



        }, function (err) {
            console.log("error in async function");

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

            res.render("hello", {returnResults : finalJSON});
        });

    }, function(error) {
        console.log("Error: " + error.code + " " + error.message);
    });

}

function composeTweets(res) {
    var app = require('../app');
    var io = app.io;

    var Twit = require('twit')

    var T = new Twit({
        consumer_key: "xHN8QKKM1XiejeCqPm28BFzvL",
        consumer_secret: "wB3zC77VyVVgSTTJPn13RaL9kzwAiFAhrYUVQag2REFNLpBFz2",
        access_token:  "28385137-v4UDWsjBLzptX4RbiZUPpCKXVVBEipyGzzGrzYehM",
        access_token_secret:  "DDHlEAb3pJU3AfSGd6Kxvrh2g5VcByAfUcSf1DyHT5eRR"
    });

//
//  search twitter for all tweets containing the word 'banana' since Nov. 11, 2011
//

    var stream = T.stream('statuses/filter', { track: ['#I140EAD', '#H4EAD', '#Immigration'] });

    io.sockets.on('connection', function (socket) {
        stream.on('tweet', function(tweet) {
            socket.emit('info', { tweet: tweet});
        });
    });

}



/* GET home page. */
router.get('/', function(req, res, next) {
    composeTweets(res);
    retrieveFeedSource(req, res);
    //console.log("sourcename is" + newResults[1]["sourceName"]);
});



module.exports = router;


