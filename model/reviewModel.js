const mongoose = require("mongoose");
const DB_LINK = process.env.DB_LINK||require("../config/secrets").DB_LINK;
mongoose
  .connect(DB_LINK, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  })
  .then(function (db) {
    // console.log(db);
    console.log("reviewDB connected");
  })
  .catch(function (err) {
    console.log(err);
  });
const reviewSchema = new mongoose.Schema({
  review: {
    type: String,
    required: [true, "Review can't be empty"]
  },
  rating: {
    type: Number,
    min: 1,
    max: 10,
    required: [true, "Review must contain some rating"]
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  plan: {
    type: mongoose.Schema.ObjectId,
    ref: "newPlanModel",
    required: [true, "Review must belong to a plan"]
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "NewUserModel",
    required: [true, "Review must have some user"]
  }
})
// find ,finone ,findById
reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name profileImage"
  }).populate("plan");
  next();
})


const reviewModel = mongoose.model("reviewModel", reviewSchema);
module.exports = reviewModel;

