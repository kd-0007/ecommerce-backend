const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const userSchema = mongoose.Schema({
    name:{
        type:String,
        required:[true, "please enter a name"]
    },
    email:{
        type:String,
        required:[true, "please enter a email"],
        unique:true,
        validate:[validator.isEmail ,"please enter a valid email"]
    },
    password:{
        type:String,
        required:[true, "please enter a password"],
        select:false
    },
    avatar: {
        // public_id:{
        //     type:String,
        //     required:true
        // },
        // url:{
            type:String,
            required:true
        // }
    },
    role:{
        type:String,
        default:"user"
    },
  createdAt: {
    type: Date,
    default: Date.now,
  },
    resetPasswordToken:String,
    resetPasswordExpire:Date,

});

userSchema.pre("save", async function(next){
    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password , 10);
    }
    next();
})

userSchema.methods.getJWTToken = function(){
    return jwt.sign({id:this._id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRE
    })
}

userSchema.methods.comparePassword = async function(password){
    return await bcrypt.compare(password, this.password);
}

userSchema.methods.getResetPassswordToken = function(){
    const token = crypto.randomBytes(20).toString('hex');
    this.resetPasswordToken = crypto.createHash("sha256").update(token).digest('hex');
    this.resetPasswordExpire = Date.now() + 15*60*1000;
    return token;
}


const User = mongoose.model("User", userSchema);

module.exports =User;