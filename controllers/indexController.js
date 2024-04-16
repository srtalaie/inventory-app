const Product = require("../models/product")
const Category = require("../models/category")

const asyncHandler = require("express-async-handler")

exports.index = asyncHandler(async (req, res, next) => {
	// Get categories and products
	const [numCategories, numProducts] = await Promise.all([
		Category.countDocuments({}).exec(),
		Product.countDocuments({}).exec(),
	])

	console.log("products:", numProducts)

	res.render("index", {
		title: "Dumb Amazon",
		product_count: numProducts,
		category_count: numCategories,
	})
})
