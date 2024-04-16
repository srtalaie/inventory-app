const express = require("express")
const router = express.Router()

// Require category controller
const product_controller = require("../controllers/productController")

// GET Product create page
router.get("/create", product_controller.product_create_get)

// POST Product create page
router.post("/create", product_controller.product_create_post)

// GET Category detail page
router.get("/:id", product_controller.product_detail)

module.exports = router
