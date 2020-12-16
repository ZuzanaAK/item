require('dotenv').config();

const bodyParser   = require('body-parser');
const cookieParser = require('cookie-parser');
const express      = require('express');
const favicon      = require('serve-favicon');
const hbs          = require('hbs');
const mongoose     = require('mongoose');
const logger       = require('morgan');
const path         = require('path');


const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app = express();

// require database configuration
require('./config/db.config');

// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());


/*
app.use(require('node-sass-middleware')({
  src:  path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  sourceMap: true
}));
*/     

// Express View engine setup

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
console.log("heeeeeeeeeeey", __dirname)
hbs.registerPartials(__dirname + "/views/partials");
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));

//session
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
 
app.use(session({
    secret: 'NotMyAge',
    saveUninitialized: false, 
    resave: false,
    cookie : {
        maxAge: 24*60*60*1000 //in milliseconds
    }, 
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
      ttl: 24*60*60 //in seconds = 1day 
    })
}));



// default value for title local
app.locals.title = '.item - exchange, donate, sell';

//routes
const index = require('./routes/index.routes');
app.use('/', index);

const authRoutes = require('./routes/auth.routes');
app.use('/', authRoutes);

const searchRoutes = require('./routes/search.routes');
app.use('/', searchRoutes);

const itemsRoutes = require('./routes/items.routes');
app.use('/', itemsRoutes);

const fileRoutes = require('./routes/file-upload.routes');
app.use('/', fileRoutes);

module.exports = app;
