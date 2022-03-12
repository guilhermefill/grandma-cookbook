// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require("dotenv/config");

// ℹ️ Connects to the database
require("./db");
var cors = require('cors')

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo");

// Handles the handlebars
// https://www.npmjs.com/package/hbs
const hbs = require("hbs");

const app = express();

app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: 'keyboardcat',
    resave: true,
    saveUninitialized: false,
    cookie: {
        httpOnly: true
    },
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI,
        ttl: 60 * 60 * 24
    })
}));

// ℹ️ This function is getting exported from the config folder. It runs most pieces of middleware
require("./config")(app);
app.use(cors({credentials: true, origin: true}))

// default value for title local
const capitalized = require("./utils/capitalized");
const projectName = "cookbook";

app.locals.appTitle = `${capitalized(projectName)} created with IronLauncher`;

// 👇 Start handling routes here
const index = require("./routes/index.routes");
app.use("/", index);

const auth = require('./routes/auth.routes');
app.use('/', auth);

const userViews = require('./routes/user.routes');
app.use('/', userViews);

const recipesViews = require('./routes/recipes.routes');
app.use('/recipe', recipesViews);

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);

module.exports = app;
