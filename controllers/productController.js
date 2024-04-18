const Product = require("../models/product")
const Category = require("../models/category")

const asyncHandler = require("express-async-handler")
const { body, validationResult } = require("express-validator")
const { all } = require("../routes/products")

// Product detail
exports.product_detail = asyncHandler(async (req, res, next) => {
	const product = await Product.findById(req.params.id)
		.populate("category")
		.exec()

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

// Display Product Create
exports.product_create_get = asyncHandler(async (req, res, next) => {
	// Get all categories
	const allCategories = await Category.find().sort({ name: 1 }).exec()

	res.render("product_form", {
		title: "Create Product",
		categories: allCategories,
	})
})

// Handle product create on POST.
exports.product_create_post = [
	// Validate and sanitize the fields
	body("name", "Name must not be empty.").trim().isLength({ min: 1 }).escape(),
	body("description", "Description must not be empty.")
		.trim()
		.isLength({ min: 1 })
		.escape(),
	body("price", "Must be a valid price").trim().toFloat().escape(),
	body("stock", "Must be a valid stock amount")
		.trim()
		.toInt()
		.escape()
		.isLength({ min: 1 }),
	body("img_url", "Must be a valid image url").trim().isURL().escape(),
	body("category.*").escape(),

	// Process request after validation and sanitization.
	asyncHandler(async (req, res, next) => {
		// Extract validation errors.
		const errors = validationResult(req)

		// Create product object with sanitized data.
		const product = new Product({
			name: req.body.name,
			description: req.body.description,
			price: req.body.price,
			stock: req.body.stock,
			img_url: req.body.img_url,
			category: req.body.category,
		})

		if (!errors.isEmpty()) {
			// There are errors. Render form again with sanitized values/error messages.

			// Get all categories for form.
			const allCategories = await Category.find().sort({ name: 1 }).exec()

			// Mark selected category as checked
			for (const category of allCategories) {
				if (product.category.includes(category._id)) {
					category.checked = "true"
				}
			}

			res.render("product_form", {
				title: "Create Product",
				categories: allCategories,
				product: product,
				errors: errors.array(),
			})
		} else {
			// Data from form is saved.
			await product.save()
			res.redirect(product.url)
		}
	}),
]

// Display Product delete
exports.product_delete_get = asyncHandler(async (req, res, next) => {
	// Get all categories
	const product = await Product.findById(req.params.id)
		.populate("category")
		.exec()

	if (product === null) {
		// No results
		res.redirect("/category")
	}

	res.render("product_delete", {
		title: "Delete Product",
		product: product,
	})
})

// Handle Product delete on POST.
exports.product_delete_post = asyncHandler(async (req, res, next) => {
	// Assume valid Product id in field.
	await Product.findByIdAndDelete(req.body.id)
	res.redirect("/category")
})

// Display Product update form on GET.
exports.product_update_get = asyncHandler(async (req, res, next) => {
	// Get Product and categories for form.
	const [product, allCategories] = await Promise.all([
		Product.findById(req.params.id).populate("category").exec(),
		Category.find().sort({ name: 1 }).exec(),
	])

	if (product === null) {
		// No results
		const err = new Error("Product not found")
		err.status = 404
		return next(err)
	}

	// Mark selected category as checked
	allCategories.forEach((category) => {
		console.log(product)
		if (product.category._id === category._id) category.checked = "true"
	})

	res.render("product_form", {
		title: "Update Product",
		categories: allCategories,
		product: product,
	})
})

// Handle Product update on POST.
exports.product_update_post = [
	// Validate and sanitize the fields
	body("name", "Name must not be empty.").trim().isLength({ min: 1 }).escape(),
	body("description", "Description must not be empty.")
		.trim()
		.isLength({ min: 1 })
		.escape(),
	body("price", "Must be a valid price").trim().toFloat().escape(),
	body("stock", "Must be a valid stock amount")
		.trim()
		.toInt()
		.escape()
		.isLength({ min: 1 }),
	body("img_url", "Must be a valid image url").trim().isURL().escape(),
	body("category.*").escape(),

	// Process request after validation and sanitization.
	asyncHandler(async (req, res, next) => {
		// Extract validation errors
		const errors = validationResult(req)

		// Create product object with sanitized data.
		const product = new Product({
			name: req.body.name,
			description: req.body.description,
			price: req.body.price,
			stock: req.body.stock,
			img_url: req.body.img_url,
			category: req.body.category,
			_id: req.params.id,
		})

		if (!errors.isEmpty()) {
			// There are errors. Get all categories for form
			const allCategories = Category.find().sort({ name: 1 }).exec()

			// Mark our selected genres as checked.
			for (const category of allCategories) {
				if (product.category.indexOf(category._id) > -1) {
					category.checked = "true"
				}
			}

			res.render("product_form", {
				title: "Update Product",
				categories: allCategories,
				product: product,
				errors: errors.array(),
			})
			return
		} else {
			// Data is valid. Update record.
			const updatedProduct = await Product.findByIdAndUpdate(
				req.params.id,
				product,
				{}
			)
			res.redirect(updatedProduct.url)
		}
	}),
]
