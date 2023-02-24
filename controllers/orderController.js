const Order = require('../models/orderModel');
const Product = require('../models/productModel');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');



exports.newOrder = catchAsyncErrors(async (req, res, next) => {
    const { shippingInfo, orderItems, paymentInfo, itemPrice, taxPrice, shippingPrice, totalPrice } = req.body;
    const order = await Order.create({ shippingInfo, orderItems, paymentInfo, itemPrice, taxPrice, shippingPrice, totalPrice, paidAt: Date.now(), user: req.user._id })
    res.status(201).json({success: true , order});
})


//get  single order
exports.getSingleOrder = catchAsyncErrors(async (req, res, next) =>{
    const order = await Order.findById(req.params.id).populate("user", "name email");
    if(!order){return next(new ErrorHandler("order not found with this id", 404));}
    res.status(200).json({success: true, order});
})

//get  all order-user
exports.myOrders = catchAsyncErrors(async (req, res, next) =>{
    const orders = await Order.find({user: req.user._id});
    res.status(200).json({success: true, orders});
})

//get  all order-admin
exports.getAllOrders = catchAsyncErrors(async (req, res, next) =>{
    const orders = await Order.find();
    let totalAmount=0;
    orders.forEach((order)=>{
        totalAmount+=order.totalPrice;
    })
    res.status(200).json({success: true, orders, totalAmount});
})

//update order status - admin
exports.updateOrder = catchAsyncErrors(async (req, res, next) =>{
    const order = await Order.findById(req.params.id);
    if(!order){return next(new ErrorHandler("Order not found", 400))};
    if(order.status==="delivered"){return next(new ErrorHandler("you have already delivered this product", 400))};
    if(order.status==="processing"){
        order.orderItems.forEach(async (item)=>{
            const product = await Product.findById(item.product);
            if(product.Stock<item.quantity){return next(new ErrorHandler("Item is not available in desired Quantity", 400))}
            product.Stock = product.Stock-item.quantity;
            await product.save({validateBeforeSave:false});
        })
    }

    order.orderStatus= req.body.status;
    if(req.body.status==="delivered"){
        order.delieverdAt=Date.now()
    };
    await order.save({validateBeforeSave:false}); 
    console.log(order.status)
    res.status(200).json({success: true});
})

//delete order  - admin
exports.deleteOrder = catchAsyncErrors(async (req, res, next) =>{
    const order = await Order.findById(req.params.id);
    if(!order){return next(new ErrorHandler("Order not found", 400))};
    await order.remove();
    res.status(200).json({success: true});
})