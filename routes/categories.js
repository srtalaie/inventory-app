const express = require("express")
const router = express.Router()

// Require category controller
const category_controller = require("../controllers/categroyController")

// GET Category create page
router.get("/create", category_controller.category_create_get)

// POST Category create page
router.post("/create", category_controller.category_create_post)

// GET Category list page
router.get("/", category_controller.category_list)

// GET Category detail page
router.get("/:id", category_controller.category_detail)

module.exports = router
