const express = require("express");
const reviewRouter = express.Router();

const { createReview, getAllReviews } = require("../controller/reviewController");
reviewRouter.route("").post(createReview).get(getAllReviews);
module.exports = reviewRouter;