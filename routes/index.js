var express = require("express")
var router = express.Router()

const category_controller = require("../controllers/categroyController")

/* GET home page. */
router.get("/", category_controller.index)

module.exports = router
