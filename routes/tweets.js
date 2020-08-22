var express = require("express");
var router = express.Router();
var config = require("../config/config");
var twitter = require("twitter");
var tweetModel = require("../models/tweet.model");
var twit = new twitter(config.TWEET_CONFIG);
var _ = require("lodash");
/* GET tweets listing. */
router.get("/getTweets", async (req, res, next) => {
  try {
    var params = {
      q: "#blockchain #bitcoin",
      count: 20,
      result_type: "recent",
      lang: "en"
    };

    await twit.get("search/tweets", params, function(err, data, response) {
      if (err) {
        res.status(400).json({
          status: false,
          msg: err
        });
        // This is where the magic will happen
      } else {
        let tweetsObj = {};
        if (data && data.statuses && data.statuses.length > 0) {
          let tweetsData = data.statuses;
          tweetsData.forEach(async element => {
            tweetsObj = {
              tweetId: element.id,
              userName:
                element.user && element.user.name ? element.user.name : null,
              description:
                element.user && element.user.description
                  ? element.user.description
                  : null,
              textValue: element.text,
              retweetCount: element.retweet_count,
              createdAt: element.created_at
            };

            await tweetModel.findOneAndUpdate(
              tweetsObj,
              {
                $setOnInsert: tweetsObj
              },
              {
                returnOriginal: false,
                upsert: true
              }
            );
          });
          res.status(200).json({
            status: true,
            msg: "Success"
          });
        } else {
          res.status(400).json({
            status: false,
            msg: "Something went wrong. Request Failed!"
          });
        }
      }
    });
  } catch (err) {
    res.status(400).json({
      status: false,
      msg: err
    });
  }
});

router.get("/getUserTweets", async (req, res, next) => {
  try {
    var params = {
      screen_name: "looksivamca",
      exclude_replies: true
    };

    await twit.get("statuses/user_timeline", params, function(
      err,
      data,
      response
    ) {
      if (err) {
        res.status(400).json({
          status: false,
          msg: err
        });
      } else {
        // console.log(data, "data======");
        if (data && data.length > 0) {
          let userArray = [];
          let sortArray = _.orderBy(data, "retweet_count", "asc");
          sortArray.forEach(value => {
            let userObj = {
              userId: value.user && value.user.id ? value.user.id : null,
              userName: value.user && value.user.name ? value.user.name : null,
              location:
                value.user && value.user.location ? value.user.location : null,
              created_at:
                value.user && value.user.created_at
                  ? value.user.created_at
                  : null,
              statuses_count:
                value.user && value.user.statuses_count
                  ? value.user.statuses_count
                  : 0,
              followers_count:
                value.user && value.user.followers_count
                  ? value.user.followers_count
                  : 0,
              friends_count:
                value.user && value.user.friends_count
                  ? value.user.friends_count
                  : 0,
              listed_count:
                value.user && value.user.listed_count
                  ? value.user.listed_count
                  : 0,
              retweet_count:
                value.retweet_count && value.retweet_count
                  ? value.retweet_count
                  : 0
            };
            userArray.push(userObj);
          });
          res.status(200).json({
            status: true,
            msg: "Success",
            data: userArray ? userArray : []
          });
        } else {
          res.status(400).json({
            status: false,
            msg: "Something went wrong. Request Failed!"
          });
        }
      }
    });
  } catch (err) {
    res.status(400).json({
      status: false,
      msg: err
    });
  }
});
module.exports = router;
