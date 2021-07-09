const express = require("express");
const router = express.Router();
const { isAdmin, isAuthenticated, isSignedin } = require("../controllers/auth");
const { getUserById, pushOrderInPurchaseList } = require("../controllers/user");
const {
  getOrderById,
  createOrder,
  getAllOrders,
  getOrderStatus,
  updateStatus,
} = require("../controllers/order");
const { updateStocks } = require("../controllers/product");

//********** ALL PARAMS ROUTES ********/

router.param("userId", getUserById);
router.param("orderId", getOrderById);

//********** ALL ACTUAL ROUTES ********/

router.post(
  "/order/create/:userId",
  isSignedin,
  isAuthenticated,
  pushOrderInPurchaseList,
  updateStocks,
  createOrder
);

router.get(
  "/order/all/:userId",
  isSignedin,
  isAuthenticated,
  isAdmin,
  getAllOrders
);

router.get(
  "/order/status/:userId",
  isSignedin,
  isAuthenticated,
  isAdmin,
  getOrderStatus
);
router.put(
  "/order/:orderId/status/:userId",
  isSignedin,
  isAuthenticated,
  isAdmin,
  updateStatus
);

module.exports = router;
