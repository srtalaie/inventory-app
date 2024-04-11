const express = require("express")
const router = express.Router()

// Require category controller
const category_controller = require("../controllers/categroyController")

// GET Category detail page
router.get("/:id", category_controller.category_detail)

module.exports = router
