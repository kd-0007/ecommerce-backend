const express = require('express');
const {registerUser, loginUser , logoutUser , forgotPassword, resetPassword, getUserDetails, updateUserPassword, updateUserProfile, getAllUsers, getSingleUser, updateUserRole, deleteUser} = require('../controllers/userController');
const { isAuthenticateUser, isAuthorizedUser } = require('../middleware/auth');

const router = express.Router();


router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/password/forgot').put(forgotPassword);
router.route('/password/reset/:token').put(resetPassword);
router.route('/password/update').put( isAuthenticateUser, updateUserPassword);
router.route('/logout').delete(logoutUser);
router.route('/me').get(getUserDetails);
router.route('/me/update').put( isAuthenticateUser,updateUserProfile);
router.route('/admin/users').get( isAuthenticateUser, isAuthorizedUser("admin"),getAllUsers);
router.route('/admin/user/:id').get( isAuthenticateUser, isAuthorizedUser("admin"),getSingleUser).put( isAuthenticateUser, isAuthorizedUser("admin"),updateUserRole).delete( isAuthenticateUser, isAuthorizedUser("admin"),deleteUser);





module.exports = router;