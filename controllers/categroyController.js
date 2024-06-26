const Product = require("../models/product")
const Category = require("../models/category")

const asyncHandler = require("express-async-handler")
const { body, validationResult } = require("express-validator")

// Category list
exports.category_list = asyncHandler(async (req, res, next) => {
	// Get categories
	const [numCategories, categories] = await Promise.all([
		Category.countDocuments({}).exec(),
		Category.find({}, "name description").sort({ name: 1 }).exec(),
	])

	res.render("category_list", {
		title: "Dumb Amazon",
		categories: categories,
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
		category: category,
	})
})

// Display category create form on GET.
exports.category_create_get = asyncHandler(async (req, res, next) => {
	res.render("category_form", { title: "Create Category" })
})

// Handle Caetgory create on POST.
exports.category_create_post = [
	// Validate and sanitize the name field.
	body(
		"name",
		"Category name must contain at least 3 characters and not exceed 100 characters"
	)
		.trim()
		.isLength({ min: 3, max: 100 })
		.escape(),
	body("description", "A description of the category is required")
		.trim()
		.escape(),

	// Process request after validation and sanitization.
	asyncHandler(async (req, res, next) => {
		// Extract validation errors
		const errors = validationResult(req)

		// Create Category object with sanatized data
		const category = new Category({
			name: req.body.name,
			description: req.body.description,
		})

		if (!errors.isEmpty()) {
			// There are errors. Render the form again with sanitized values/error messages.
			res.render("category_form", {
				title: "Create Category",
				category: category,
				errors: errors.array(),
			})
			return
		} else {
			// Data from form is valid.
			// Check if Category with same name already exists.
			const categoryExists = await Category.findOne({ name: req.body.name })
				.collation({ locale: "en", strength: 2 })
				.exec()

			if (categoryExists) {
				// Genre exists, redirect to its detail page.
				res.redirect(categoryExists.url)
			} else {
				await category.save()
				// New genre is saved, redirect to genre detail page
				res.redirect(category.url)
			}
		}
	}),
]

// Display Category delete form on GET.
exports.category_delete_get = asyncHandler(async (req, res, next) => {
	// Get category and associated products in parallel
	const [category, allProductsInCategory] = await Promise.all([
		Category.findById(req.params.id).exec(),
		Product.find({ category: req.params.id }, "name").exec(),
	])

	if (category === null) {
		// No results
		res.redirect("/category")
	}

	res.render("category_delete", {
		title: "Delete Category",
		category: category,
		category_products: allProductsInCategory,
	})
})

// Handle Category delete on POST.
exports.category_delete_post = asyncHandler(async (req, res, next) => {
	// Get details of category and all their products (in parallel)
	const [category, allProductsInCategory] = await Promise.all([
		Category.findById(req.params.id).exec(),
		Product.find({ category: req.params.id }, "name").exec(),
	])

	if (allProductsInCategory.length > 0) {
		// Category has products. Render in same way as for GET route.
		res.render("category_delete", {
			title: "Delete Category",
			category: category,
			category_products: allProductsInCategory,
		})
		return
	} else {
		// Category has no products. Delete object and redirect to the list of categories.
		await Category.findByIdAndDelete(req.body.categoryid)
		res.redirect("/category")
	}
})

// Display Category update form on GET.
exports.category_update_get = asyncHandler(async (req, res, next) => {
	const category = await Category.findById(req.params.id).exec()

	if (category === null) {
		// No results
		const err = new Error("Category not found.")
		err.status = 404
		return next(err)
	}

	res.render("category_form", {
		title: "Update Category",
		category: category,
	})
})

// Handle Category update on POST.
exports.category_update_post = [
	// Validate and sanitize the name field.
	body(
		"name",
		"Category name must contain at least 3 characters and not exceed 100 characters"
	)
		.trim()
		.isLength({ min: 3, max: 100 })
		.escape(),
	body("description", "A description of the category is required")
		.trim()
		.escape(),

	// Process request after validation and sanitization.
	asyncHandler(async (req, res, next) => {
		// Extract errors from validation/sanitization
		const errors = validationResult(req)

		// Create new author with validated data
		const category = new Category({
			name: req.body.name,
			description: req.body.description,
			_id: req.params.id,
		})

		if (!errors.isEmpty) {
			res.render("category_form", {
				title: "Update Category",
				category: category,
				errors: errors.array(),
			})
			return
		} else {
			await Category.findByIdAndUpdate(req.params.id, category)
			res.redirect(category.url)
		}
	}),
]
