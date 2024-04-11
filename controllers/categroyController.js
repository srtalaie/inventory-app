const Product = require("../models/product")
const Category = require("../models/category")

const asyncHandler = require("express-async-handler")
const { body, validationResult } = require("express-validator")

// Category list
exports.index = asyncHandler(async (req, res, next) => {
	// Get categories
	const [numCategories, categories] = await Promise.all([
		Category.countDocuments({}).exec(),
		Category.find({}, "name description").sort({ name: 1 }).exec(),
	])

	res.render("index", {
		title: "Dumb Amazon",
		categories: categories,
		category_count: numCategories,
	})
})

// Page for specific category and it's products
exports.category_detail = asyncHandler(async (req, res, next) => {
	// Get category detail and procuts under that category
	const [category, products] = await Promise.all([
		Category.findById(req.params.id).exec(),
		Product.find({ category: req.params.id }, "name img_url price"),
	])

	if (category === null) {
		const err = new Error("Category not found.")
		err.status = 404
		return next(err)
	}

	res.render("category_detail", {
		title: category.name,
		description: category.description,
		products: products,
	})
})
