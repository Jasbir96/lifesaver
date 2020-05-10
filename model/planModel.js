// mongoose
const mongoose = require("mongoose");
// mongoose => promise based library
// connection
const DB_LINK = process.env.DB_LINK||require("../config/secrets").DB_LINK;

mongoose
  .connect(DB_LINK, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  })
  .then(function (db) {
    // console.log(db);
    console.log("PlanDB connected");
  })
  .catch(function (err) {
    console.log(err);
  });

// schema ,unique => model=> enteries
//schema unique=> enteries

const planSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    maxlength: [40, "Your plan length is more than 40 characters"],
  },
  duration: { type: Number, required: [true, "You Need to provide duration"] },
  price: {
    type: Number,
    required: true,
  },
  ratingsAverage: {
    type: Number,
  },
  discount: {
    type: Number,
    validate: {
      validator: function () {
        return this.discount < this.price;
      },
      message: "Discount must be less than actual price",
    },
  },
});
const newPlanModel = mongoose.model("newPlanModel", planSchema);

module.exports = newPlanModel;
