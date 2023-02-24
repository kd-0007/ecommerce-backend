const Product = require('../models/productModel');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const ApiFeatures = require('../utils/apifeatures');




//to add product
exports.createProduct = catchAsyncErrors(async (req, res, next) => {
    req.body.user = req.user._id;
    const product = await Product.create(req.body);
    res.status(201).json({
        success:true,
        product
    })
})


// fetch all products
exports.getAllProducts = catchAsyncErrors(async (req, res,next)=>{
    // return next(new ErrorHandler("product not found" , 404));
    const productCount = await Product.countDocuments();
    const resultPerPage = 8;
    // console.log(req.query);
    const apifeatures = new ApiFeatures(Product.find(), req.query).search().filter();
    let products = await apifeatures.query;
    const filteredProductsCount = products.length;
    apifeatures.pagination(resultPerPage);
    products = await apifeatures.query.clone();
    res.status(200).json({
        success:true,
        products,
        productCount,
        resultPerPage,
        filteredProductsCount
    })
})

//update product
exports.updateProduct = catchAsyncErrors( async (req, res, next) => {
    let product = await Product.findById(req.params.id);
    if(!product){return next(new ErrorHandler("product not found" , 404));}
    product = await Product.findByIdAndUpdate({_id:req.params.id} , {$set:req.body} ,{new:true})
    res.status(201).json({
        success:true,
        product
    })

})

//delete product
exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {
    let product = await Product.findById(req.params.id);
    if(!product){return res.status(404).json({
        success:false,
        message:"product not found"
    }) }

    await product.remove();
    res.status(201).json({
        success:true,
        product
    })

})


//get single product details
exports.geProductDetails = catchAsyncErrors(async (req, res, next) => {
    let product = await Product.findById(req.params.id);
    if(!product){return res.status(404).json({
        success:false,
        message:"product not found"
    }) }

       
    res.status(201).json({
        success:true,
        product
    })

})

//to add or create a review
exports.addProductReview = catchAsyncErrors(async (req, res, next) => {

    const {comment , rating , productID}= req.body;
    const review = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment: comment
    }
    const product = await Product.findById(productID);
    const isReviewed = product.reviews.find((rev)=>{ return rev.user.toString()===req.user._id.toString()});
    
    if(isReviewed){
        product.reviews.forEach((rev)=>{
            if(rev.user.toString()===req.user._id.toString()){
                rev.rating=rating;
                rev.comment = comment;
            }
        })

    }else{
        product.reviews.push(review);
        
    }
    product.numOfReviews= product.reviews.length;
    let avg= 0;
    product.reviews.forEach((rev)=>{
        avg=avg+rev.rating;
    })
    product.ratings = avg/product.reviews.length;

    await product.save({validateBeforeSave:false});
    res.status(201).json({
        success:true,
        message:"Your review has been  added successfully"
    })

})

//get all reviews of the product
exports.getAllReviews = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.query.id);
    if(!product){return next(new ErrorHandler("product not found", 404))};
    res.status(200).json({
        success: true,
        reviews: product.reviews
    })
});

//delete a review of the product
exports.deleteReview = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.query.productID);
    if(!product){return next(new ErrorHandler("product not found", 404))};
    const reviews = product.reviews.filter((rev)=>{rev._id.toString() !== req.query.id.toString()});
    let avg= 0;
    reviews.forEach((rev)=>{
        avg=avg+rev.rating;
    })
    product.ratings = avg/reviews.length ||0;
    product.numOfReviews= reviews.length;
    product.reviews= reviews;
    await product.save({validateBeforeSave:false});

    res.status(200).json({
        success: true,
        reviews: product.reviews
    })
});


// fetch all products (admin)
exports.getAllProductsAdmin = catchAsyncErrors(async (req, res,next)=>{

    const products = await Product.find()
    res.status(200).json({
        success:true,
        products
    })
})