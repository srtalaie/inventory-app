const Product = require("../models/product")
const Category = require("../models/category")

const asyncHandler = require("express-async-handler")

// Category list
exports.index = asyncHandler(async (req, res, next) => {
	// Get categories
	const [numCategories, categories] = await Promise.all([
		Category.countDocuments({}).exec(),
		Category.find({}, "name description").sort({ name: 1 }).exec(),
	])

	console.log(categories)

	res.render("index", {
		title: "Dumb Amazon",
		categories: categories,
		category_count: numCategories,
	})
})
