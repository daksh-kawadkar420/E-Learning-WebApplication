const Product = require("../models/product");
const formidable = require("formidable"); /**It is used to maintain incoming data and file uploads */
const _ = require("lodash"); /**Lodash is a JavaScript library that helps programmers write more concise and maintainable */
const fs = require("fs"); /**Allows us to workwith file structure */

exports.getProductById = (req, res, next, id) => {
  Product.findById(id)
    .populate("category")
    .exec((err, product) => {
      if (err) {
        return res.status(400).json({
          error: "No product in Database with this ID.",
        });
      }
      req.product = product;
      next();
    });
};

exports.createProduct = (req, res) => {
  let form = formidable.IncomingForm();
  form.keepExtentions = true;

  form.parse(req, (err, fields, file) => {
    if (err) {
      return res.status(400).json({
        error: "Problem with the image..",
      });
    }

    //DESTRUCTURING THE FIELDS
    const { name, description, price, category, stock } = fields;

    if (!name || !description || !price || !category || !stock) {
      return res.status(400).json({
        error: "Please include all fields.",
      });
    }

    //TODO: Restrictions on fields
    let product = new Product(fields);

    //HANDLE FILE HERE

    if (file.photo) {
      if (file.photo.size > 3000000) {
        return res.status(400).json({
          error: "File size too big!!",
        });
      }
      product.photo.data = fs.readFileSync(file.photo.path);
      product.photo.contentType = file.photo.type;
    }

    //SAVE TO DB

    product.save((err, product) => {
      if (err) {
        return res.status(400).json({
          error: "Problem in saving photos in DB",
        });
      }
      res.json(product);
    });
  });
};

exports.getProduct = (req, res) => {
  req.product.photo = undefined;
  return res.json(req.product);
};

//MIDDLEWARE
exports.photo = (req, res, next) => {
  if (req.product.photo.data) {
    res.set("Content-Type", req.product.photo.contentType);
    return res.send(req.product.photo.data);
  }
  next();
};

exports.updateProduct = (req, res) => {
  let form = formidable.IncomingForm();
  form.keepExtentions = true;

  form.parse(req, (err, fields, file) => {
    if (err) {
      return res.status(400).json({
        error: "Problem with the image..",
      });
    }

    let product = req.product;
    product = _.extend(product, fields);

    //HANDLE FILE HERE

    if (file.photo) {
      if (file.photo.size > 3000000) {
        return res.status(400).json({
          error: "File size too big!!",
        });
      }
      product.photo.data = fs.readFileSync(file.photo.path);
      product.photo.contentType = file.photo.type;
    }

    //SAVE TO DB

    product.save((err, product) => {
      if (err) {
        return res.status(400).json({
          error: "Updated Sucessfully..",
        });
      }
      res.json(product);
    });
  });
};

exports.deleteProduct = (req, res) => {
  const product = req.product;
  product.remove((err, deletedProduct) => {
    if (err) {
      return res.status(400).json({
        error: "Sorry, Unable to delete the desires product.",
      });
    }
    res.json({
      message: `${deletedProduct}Sucessfully Deleted.`,
    });
  });
};

exports.getAllProducts = (req, res) => {
  let limit = req.body.limit ? req.body.limit : 8;
  let sortBy = req.body.sortBy ? req.body.sortBy : "_id";

  Product.find()
    .select("-photo")
    .populate("category")
    .limit(limit)
    .sort([[sortBy, "asc"]])
    .exec((err, products) => {
      if (err) {
        return res.status(400).json({
          error: "NO product found",
        });
      }
      res.json(products);
    });
};

exports.updateStocks = (req, res) => {
  let myOperations = req.body.order.Product.map((prod) => {
    return {
      updateOne: {
        filter: { _id: product._id },
        update: { $inc: { stock: -product.count, sold: +product.count } },
      },
    };
  });
  Product.bulkWrite(myOperations, {}, (err, products) => {
    if (err) {
      return res.status(400).json({
        error: "BULK operations failed..",
      });
    }
    next();
  });
};

exports.getAllUniqueCategories = (req, res) => {
  Product.distinct("category", {}, (err, category) => {
    if (err) {
      return res.status(400).json({
        error: "No categories found...",
      });
    }
    res.json(category);
  });
};
