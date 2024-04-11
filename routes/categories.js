const express = require("express")
const router = express.Router()

// Require category controller
const category_controller = require("../controllers/categroyController")

/// Category ROUTES ///

// GET home page.
router.get("/", category_controller.index)

module.exports = router
