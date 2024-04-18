const express = require("express")
const router = express.Router()

// Require Product controller
const product_controller = require("../controllers/productController")

// GET Product create page
router.get("/create", product_controller.product_create_get)

// POST Product create page
router.post("/create", product_controller.product_create_post)

// GET Product detail page
router.get("/:id", product_controller.product_detail)

// GET Product delete page
router.get("/:id/delete", product_controller.product_delete_get)

// POST Product delete page
router.post("/:id/delete", product_controller.product_delete_post)

// GET Product update page
router.get("/:id/update", product_controller.product_update_get)

// POST Product update page
router.post("/:id/update", product_controller.product_update_post)

module.exports = router
