var express = require('express');
var router = express.Router();
//var gfeed = require('google-feed-api');
var gfeed = require('feed-read-master');
var async = require('async-master');
var Twit = require('twit');


function retrieveFeedSource(res) {
    //console.log("inside retrieveFeedSource function")
    var FeedSource = Parse.Object.extend("FeedSource");
    //console.log("FeedSource");
    var query = new Parse.Query(FeedSource);
    var finalDict = [];
    var queryResults = [{}];
    var count = 0;

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
            res.render("hello", {returnResults : finalDict});
        });

    }, function(error) {
        console.log("Error: " + error.code + " " + error.message);
    });

}

function composeTweets(res) {
    var Twit = require('twit')

    var T = new Twit({
        consumer_key:         'PNvpyiqMIWhQoDWGF4lhWce5u'
        , consumer_secret:      '20OFaWoEOUa2cvaK2clj6h1DdZ3IS7ETXu691sz9BcLhGdTHHM'
        , app_only_auth:        true
    });

//
//  search twitter for all tweets containing the word 'banana' since Nov. 11, 2011
//

    var stream = T.stream('statuses/filter', { track: ['#I140EAD', '#H4EAD', '#Immigration'] });

    stream.on('tweet', function (tweet) {
        console.log(tweet);
    })

}



/* GET home page. */
router.get('/', function(req, res, next) {
    //composeTweets(res);
    retrieveFeedSource(res);
    //console.log("sourcename is" + newResults[1]["sourceName"]);
});



module.exports = router;


