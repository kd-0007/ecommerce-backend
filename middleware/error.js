const ErrorHandler = require('../utils/errorHandler');


module.exports = (err , req, res, next)=>{
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "internal server error";

    //wrong mongoId error
    if(err.name === "CastError"){
        const message =`Resources not found. Invalid ${err.path}`;
        err = new ErrorHandler(message , 400)
    }
    //duplicates key error
    if(err.code === 11000){
        const message =`Duplicate ${Object.keys(err.keyValue)} error`;
        err = new ErrorHandler(message , 400)
    }
    //JWT error
    if(err.name === "JsonWebTokenError"){
        const message =`JSON Web Token is not valid`;
        err = new ErrorHandler(message , 400)
    }
    //JWT expire error
    if(err.name === "TokenExpiredError"){
        const message =`Token is expired`;
        err = new ErrorHandler(message , 400)
    }
    

    res.status(err.statusCode).json({
        success:false,
        message:err.message
    })

} 