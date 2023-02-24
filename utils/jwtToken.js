const sendToken = (user,statuscode , res )=>{
    const token = user.getJWTToken();

    const options = {
        httpOnly: true,
        expires :new Date(
            Date.now() +process.env.COOKIE_EXPIRE*24*60*60*1000
        )
    }
    
    res.status(statuscode).cookie("token", token,options).json({
        statuscode,
        user,
        token

    })
}

module.exports  = sendToken;