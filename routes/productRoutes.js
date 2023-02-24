const express= require("express");
const { getAllProducts , createProduct , updateProduct, deleteProduct, geProductDetails, addProductReview, deleteReview, getAllReviews,getAllProductsAdmin } = require("../controllers/productController");
const { isAuthenticateUser , isAuthorizedUser } = require("../middleware/auth");
const router = express.Router();

router.route("/products").get(getAllProducts);
router.route("/admin/product/new").post( isAuthenticateUser,isAuthorizedUser('admin') ,createProduct);
router.route("/admin/products").get( isAuthenticateUser,isAuthorizedUser('admin') ,getAllProductsAdmin);
router.route("/admin/product/:id").put(isAuthenticateUser,isAuthorizedUser('admin'),updateProduct).delete(isAuthenticateUser,isAuthorizedUser('admin'),deleteProduct);
router.route("/product/:id").get(geProductDetails);
router.route("/product/review").post(isAuthenticateUser,addProductReview);
router.route("/reviews").get(getAllReviews).delete(isAuthenticateUser,deleteReview);

module.exports = router;