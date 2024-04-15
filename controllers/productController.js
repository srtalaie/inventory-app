const Product = require("../models/product")
const Category = require("../models/category")

const asyncHandler = require("express-async-handler")
const { body, validationResult } = require("express-validator")

// Product detail
exports.product_detail = asyncHandler(async (req, res, next) => {
	const product = await Product.findById(req.params.id)
		.populate("category")
		.exec()

	console.log(product)
	if (product === null) {
		const err = new Error("Product not found.")
		err.status = 404
		return next(err)
	}

	res.render("product_detail", {
		title: product.name,
		product: product,
	})
})
