const express = require("express")
const router = express.Router()

// Require category controller
const product_controller = require("../controllers/productController")

// GET Category detail page
router.get("/:id", product_controller.product_detail)

module.exports = router
