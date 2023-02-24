const catchAsyncErrors = require("./catchAsyncErrors");
const ErrorHandler = require('../utils/errorHandler');
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");


exports.isAuthenticateUser =catchAsyncErrors(async (req, res, next)=>{
    const {token} = req.cookies;
    if(!token){return next(new ErrorHandler("please login first" , 401))};
    const decodedData = jwt.verify(token , process.env.JWT_SECRET);
    if(!decodedData){
        res.cookie("token", null,{httpOnly: true, expires:new Date(Date.now())});
    }
    req.user = await User.findById({_id: decodedData.id});
    next();

})

exports.isAuthorizedUser = (...roles)=>{
    
        return (req , res , next) =>{
            if(!roles.includes(req.user.role)){
                return next(  new ErrorHandler(`role:${req.user.role} account is not authorized for this operation`));
            }
            next();
        }
}