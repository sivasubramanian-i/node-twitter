const autopopulate = require("mongoose-autopopulate");
const db = require("../config/db");

var tweetSchema = new db.mongoose.Schema(
  {
    tweetId: {
      type: String,
      default: null
    },
    userName: {
      type: String,
      default: null
    },
    description: {
      type: String,
      default: null
    },
    textValue: {
      type: String,
      default: null
    },
    retweetCount: {
      type: Number,
      default: 0
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  },
  { timestamps: true, minimize: false, collection: "tweet" }
);

tweetSchema.plugin(autopopulate);

module.exports = db.mongoose.model("tweetModel", tweetSchema);
