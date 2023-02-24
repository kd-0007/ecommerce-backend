const catchAsyncErros = require("../middleware/catchAsyncErrors");
const stripe = require("stripe")(process.env.STRIPE_KEY);

exports.processPayment = catchAsyncErros(async (req,res,next) => {
    const payment = await stripe.paymentIntents.create({
        amount:req.body.amount,
        currency:"inr",
        metadata:{
            company:"Ecommerce"
        }
    })
    res.status(200).json({
        success:true,
        client_secret:payment.client_secret
    })
});


exports.sendStripeApi = catchAsyncErros(async (req,res,next) => {

    res.status(200).json({
        success:true,
        stripeApiKey:process.env.STRIPE_ID
    })
});