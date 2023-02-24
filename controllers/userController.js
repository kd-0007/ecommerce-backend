const User = require('../models/userModel');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const sendToken = require('../utils/jwtToken');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');
const jwt = require("jsonwebtoken");



exports.registerUser =catchAsyncErrors( async (req, res)=>{
    const {name , email , password,avatar} = req.body;
    const user = await User.create({
        name ,
        email,
        password,
        avatar
    })
    sendToken(user, 201 , res);
})

exports.loginUser = catchAsyncErrors(async(req, res,next)=>{
    const {email, password} = req.body;
    if(!email || !password){return next(new ErrorHandler("please enter email and password" , 404)) };
    const user = await User.findOne({email}).select("+password");
    if(!user){return next(new ErrorHandler("your email and password is incorrect" ,401)) };
    const isPasswordMatched = await user.comparePassword(password);
    if(!isPasswordMatched){return next(new ErrorHandler("your email and password is incorrect" , 401)) };
    sendToken(user,200,res);
})

exports.logoutUser = catchAsyncErrors(async (req , res)=>{
    // res.clearCookie("token")
    const options = {
        httpOnly: true,
        expires :new Date(
            Date.now()
        )
    }
    res.status(201).cookie("token" , null,options).json({
        success: true,
        message: "you have been logged out successfully"
    })
})


exports.forgotPassword = catchAsyncErrors(async (req , res ,next)=>{
    const user = await User.findOne({email: req.body.email});
    if(!user){return next(new ErrorHandler("account not found" , 404))};
    const resetToken = user.getResetPassswordToken();
    await user.save({validateBeforeSave:false});
    const resetPasswordURL = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`;
    const message = `Your password reset URL is \n\n ${resetPasswordURL} , please ignore this message if you didnt requested`;
    try {
        await sendEmail({
            email: user.email,
            subject: 'Your password reset link',
            message:message
        })
        res.status(201).json({success: true , message:`Email sent successfully to ${user.email}`});
    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire= undefined;
        await user.save({validateBeforeSave:false});
        return next(new ErrorHandler(error.message , 500))
    }

});

exports.resetPassword = catchAsyncErrors(async(req, res, next)=>{
    const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex");
    const user = await User.findOne({resetPasswordToken , resetPasswordExpire:{$gt:Date.now()}});
    if(!user){ return next(new ErrorHandler("Token is not valid or Expired ",400)) };
    if(req.body.password !==req.body.confirmPassword){return next(new ErrorHandler("Password do not match with confirmPassword",400))};
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({validateBeforeSave:false});
    res.status(200).json({
        success: true,
        message: "Password updated successfully"
    })
    // sendToken(user,200,res);
});

//for User
exports.getUserDetails= catchAsyncErrors(async (req, res, next) => {
    const {token} = req.cookies;
    if(!token){
        res.status(200).json({
            success: false
        })
        return
    };
    const decodedData = jwt.verify(token , process.env.JWT_SECRET);
    if(!decodedData){
        res.cookie("token", null,{httpOnly: true, expires:new Date(Date.now())});
        return;
    }
    const user = await User.findById({_id:decodedData.id});
    res.status(200).json({
        success: true,
        user
    })
})

exports.updateUserPassword = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user.id).select("+password");
    const isPasswordMatched = await user.comparePassword(req.body.oldPassword);
    if(!isPasswordMatched){return next(new ErrorHandler("Old password mismatch", 400))};
    if(req.body.newPassword !== req.body.confirmPassword){return next(new ErrorHandler("password mismatch", 400))};
    user.password = req.body.newPassword;
    await user.save();

    res.status(201).json({
        success: true,
        message: "Password changed successfully"
    })
    
})

exports.updateUserProfile = catchAsyncErrors(async (req, res, next) => {
    const newData = {
        name: req.body.name,
        email: req.body.email,
        avatar: req.body.avatar
    }
    await User.findByIdAndUpdate(req.user.id, newData); 


    res.status(201).json({
        success: true,
        message: "user updated successfully"
    })
    
})

//for Admin
exports.getAllUsers= catchAsyncErrors(async (req, res, next) => {
    const users = await User.find();
    res.status(200).json({
        success: true,
        users
    })
})

//for Admin
exports.getSingleUser = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    if(!user){return next(new ErrorHandler("User not found", 404))}
    res.status(200).json({
        success: true,
        user
    })
})

//for Admin
exports.updateUserRole = catchAsyncErrors(async (req, res, next) => {
    const newData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role,
    }
    await User.findByIdAndUpdate(req.params.id, newData); 


    res.status(201).json({
        success: true,
        message: "user updated successfully"
    })
    
})

//for Admin
exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.params.id); 
    if(!user){return next(new ErrorHandler("User not found", 404))};
    await user.remove();

    res.status(201).json({
        success: true,
        message: "user deleted successfully"
    })
    
})