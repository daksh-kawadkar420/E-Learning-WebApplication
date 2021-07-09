const Category = require("../models/category");

exports.getCategoryById = (req, res, next, id) => {
  Category.findById(id).exec((err, category) => {
    if (err) {
      return res.status(400).json({
        error: "No categories found in DB.",
      });
    }
    req.Category = category;
    // console.log(req.Category);
    next();
  });
};

exports.createCategory = (req, res) => {
  const category = new Category(req.body);
  category.save((err, category) => {
    if (err) {
      return res.status(400).json({
        error: "Not able to save category in DB.",
      });
    }
    res.json({ category });
  });
};

exports.getCategory = (req, res) => {
  return res.json(req.Category);
};

exports.getAllCategory = (req, res) => {
  Category.find().exec((error, categories) => {
    if (error) {
      return res.json({
        error: "No categories in DB.",
      });
    }
    res.json(categories);
  });
};

exports.updateCategory = (req, res) => {
  const category = req.Category;
  category.name = req.body.name;
  console.log(req.category);
  category.save((err, updateCategory) => {
    if (err) {
      return res.status(400).json({
        error: "Sorry, Unable to update.",
      });
    }
    res.json(updateCategory);
  });
};

exports.removeCategory = (req, res) => {
  const category = req.Category;
  category.remove((err, category) => {
    if (err) {
      return res.status(400).json({
        error: "Sorry, Unable to delete.",
      });
    }
    res.json({
      Message: `${category}Sucessfully Deleted!!!`,
    });
  });
};
