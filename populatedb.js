#! /usr/bin/env node

console.log(
	'This script populates some test products and categories to your database. Specified database as argument - e.g.: node populatedb "mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/local_library?retryWrites=true&w=majority"'
)

// Get arguments passed on command line
const userArgs = process.argv.slice(2)

const Product = require("./models/product")
const Category = require("./models/category")

const products = []
const categories = []

const mongoose = require("mongoose")
mongoose.set("strictQuery", false)

const mongoDB = userArgs[0]

main().catch((err) => console.log(err))

async function main() {
	console.log("Debug: About to connect")
	await mongoose.connect(mongoDB)
	console.log("Debug: Should be connected?")
	await createCategories()
	await createProducts()
	console.log("Debug: Closing mongoose")
	mongoose.connection.close()
}

async function productCreate(
	index,
	name,
	description,
	category,
	price,
	stock,
	img_url
) {
	const productDetail = {
		name: name,
		description: description,
		category: category,
		price: price,
		stock: stock,
		img_url: img_url,
	}
	if (category != false) productDetail.category = category

	const product = new Product(productDetail)

	await product.save()
	products[index] = product
	console.log(`Added product: ${name} in ${category}`)
}

async function categoryCreate(index, name, description) {
	const categoryDetail = {
		name: name,
		description: description,
	}

	const category = new Category(categoryDetail)
	await category.save()
	categories[index] = category
	console.log(`Added category: ${name}`)
}

async function createCategories() {
	console.log("Adding categories")
	await Promise.all([
		categoryCreate(0, "Category 0", "Description for Category 0"),
		categoryCreate(1, "Category 1", "Description for Category 1"),
		categoryCreate(2, "Category 2", "Description for Category 2"),
		categoryCreate(3, "Category 3", "Description for Category 3"),
	])
}

async function createProducts() {
	console.log("Adding products")
	await Promise.all([
		productCreate(
			0,
			"Product 1",
			"Description of product 1",
			categories[0],
			19.99,
			100,
			"https://picsum.photos/200/300"
		),
		productCreate(
			1,
			"Product 2",
			"Description of product 2",
			categories[0],
			29.99,
			50,
			"https://picsum.photos/200/300"
		),
		productCreate(
			2,
			"Product 3",
			"Description of product 3",
			categories[1],
			39.99,
			75,
			"https://picsum.photos/200/300"
		),
		productCreate(
			3,
			"Product 4",
			"Description of product 4",
			categories[2],
			109.99,
			217,
			"https://picsum.photos/200/300"
		),
		productCreate(
			4,
			"Product 5",
			"Description of product 5",
			categories[0],
			5.49,
			9,
			"https://picsum.photos/200/300"
		),
	])
}
