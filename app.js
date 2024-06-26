require("dotenv").config()
const createError = require("http-errors")
const express = require("express")
const path = require("path")
const cookieParser = require("cookie-parser")
const logger = require("morgan")
const cors = require("cors")

const indexRouter = require("./routes/index")
const usersRouter = require("./routes/users")
const categoryRouter = require("./routes/categories")
const productRouter = require("./routes/products")

const compression = require("compression")
const helmet = require("helmet")

const app = express()

// Set up rate limiter: maximum of twenty requests per minute
const RateLimit = require("express-rate-limit")
const limiter = RateLimit({
	windowMs: 1 * 60 * 1000, // 1 minute
	max: 40,
})
// Apply rate limiter to all requests
app.use(limiter)

// Set up mongoose connection
const mongoose = require("mongoose")
mongoose.set("strictQuery", false)
const mongoDB =
	process.env.NODE_ENV == "development"
		? process.env.MONGO_URI_DEV
		: process.env.MONGO_URI_PROD

main().catch((err) => console.log(err))
async function main() {
	await mongoose.connect(mongoDB)
}

// view engine setup
app.set("views", path.join(__dirname, "views"))
app.set("view engine", "pug")

app.use(cors())
app.use(logger("dev"))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(compression()) // Compress all routes

// Add helmet to the middleware chain.
// Set CSP headers to allow our Bootstrap and Jquery to be served
app.use(
	helmet.contentSecurityPolicy({
		directives: {
			"script-src": ["'self'", "code.jquery.com", "cdn.jsdelivr.net"],
			"img-src": ["'self'", "https: data:"],
		},
	})
)

app.use(express.static(path.join(__dirname, "public")))

app.use("/", indexRouter)
app.use("/category", categoryRouter)
app.use("/users", usersRouter)
app.use("/product", productRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message
	res.locals.error = req.app.get("env") === "development" ? err : {}

	// render the error page
	res.status(err.status || 500)
	res.render("error")
})

module.exports = app
