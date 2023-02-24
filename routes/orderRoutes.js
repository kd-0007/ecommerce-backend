const express = require('express');
const { newOrder, getSingleOrder, myOrders, getAllOrders, updateOrder, deleteOrder } = require('../controllers/orderController');
const { isAuthenticateUser, isAuthorizedUser } = require('../middleware/auth');
const router = express.Router();

router.route('/order/new').post(isAuthenticateUser,newOrder);
router.route('/order/:id').get(isAuthenticateUser, getSingleOrder);
router.route('/orders/me').get(isAuthenticateUser,myOrders);
router.route('/admin/orders').get(isAuthenticateUser,isAuthorizedUser("admin"), getAllOrders);
router.route('/admin/order/:id').put(isAuthenticateUser,isAuthorizedUser("admin"), updateOrder).delete(isAuthenticateUser,isAuthorizedUser("admin"), deleteOrder);



module.exports = router;