const express = require("express");
const router = express.Router();

const {
  getProductById,
  createProduct,
  getProduct,
  photo,
  deleteProduct,
  updateProduct,
  getAllProducts,
  getAllUniqueCategories,
} = require("../controllers/product");
const { isSignedin, isAuthenticated, isAdmin } = require("../controllers/auth");
const { getCategoryById } = require("../controllers/category");
const { getUserById } = require("../controllers/user");

//***********ALL OF THE PARAMS***************//

router.param("userId", getUserById);
router.param("productId", getProductById);

//*ALL OF ACTUAL ROUTES *//

/* CREATE ROUTES */
router.post(
  "/product/create/:userId",
  isSignedin,
  isAuthenticated,
  isAdmin,
  createProduct
);

/* READ ROUTES */

router.get("/product/:productId", getProduct);
router.get("/product/photo/:productId", photo);

/* UPDATE ROUTES */

router.put(
  "/product/:productId/:userId",
  isSignedin,
  isAuthenticated,
  isAdmin,
  updateProduct
);

/* DELETE ROUTES */

router.delete(
  "/product/:productId/:userId",
  isSignedin,
  isAuthenticated,
  isAdmin,
  deleteProduct
);

/* LISTING ROUTES */

router.get("/products", getAllProducts);
router.get("/products/categories", getAllUniqueCategories);

module.exports = router;
