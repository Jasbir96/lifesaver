// process.env.SK=> mention variable
let SK=process.env.SK||require("../config/secrets").SK;
const stripe = require("stripe")(SK);
const planModel = require("../model/planModel");
const userModel = require("../model/userModel");
async function createSession(req, res) {
  // retrive your plan and user
  try {

    let { id } = req
    let userId = id;
    let { planId } = req.body;

    const user = await userModel.findById(userId);
    const plan = await planModel.findById(planId);
    //  create session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: user.email,
      client_refernce_id: req.planId,
      line_items: [
        {
          name: plan.name,
          description: plan.description,
          // deploy website 
          amount: plan.price * 100,
          currency: "inr",
          quantity: 1
        }
      ],
      // dev => http
      // production => https 
      success_url: `${req.protocol}://${req.get("host")}/profile`,
      cancel_url: `${req.protocol}://${req.get("host")}/profile`
    })
    res.status(200).json({
      status: "success",
      session
    })
  } catch (err) {
    res.status(200).json({
      err: err.message
    })
  }
}
module.exports.createSession = createSession;