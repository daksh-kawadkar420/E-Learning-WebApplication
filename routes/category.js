const express = require("express");
const router = express.Router();

const {
  getCategoryById,
  createCategory,
  getCategory,
  getAllCategory,
  updateCategory,
  removeCategory,
} = require("../controllers/category");
const { isAdmin, isAuthenticated, isSignedin } = require("../controllers/auth");
const { getUserById } = require("../controllers/user");

//PARAMS
router.param("categoryId", getCategoryById);
router.param("userId", getUserById);

//ACTUAL ROUTES GOES HERE

//CREATE ROUTES
router.post(
  "/category/create/:userId",
  isSignedin,
  isAuthenticated,
  isAdmin,
  createCategory
);

//READ ROUTES

router.get("/category/:categoryId", getCategory);
router.get("/categories", getAllCategory);

//UPDATE ROUTES

router.put(
  "/category/:categoryId/:userId",
  isSignedin,
  isAuthenticated,
  isAdmin,
  updateCategory
);

//DELETE ROUTES

router.delete(
  "/category/:categoryId/:userId",
  isSignedin,
  isAuthenticated,
  isAdmin,
  removeCategory
);

module.exports = router;
