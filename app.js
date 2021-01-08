require('dotenv').config();

const bodyParser   = require('body-parser');
const cookieParser = require('cookie-parser');
const express      = require('express');
const favicon      = require('serve-favicon');
const hbs          = require('hbs');
const mongoose     = require('mongoose');
const logger       = require('morgan');
const path         = require('path');

const bcrypt = require('bcrypt');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

const User = require('./models/User.model.js');

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

//Mongoose set up
mongoose.set('useFindAndModify', false);
  

// Express View engine setup

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
hbs.registerPartials(__dirname + "/views/partials");
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));

//session
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
 

passport.serializeUser((user, cb) => cb(null, user._id));

passport.deserializeUser((id, cb) => {
  User.findById(id)
  .then( user => cb(null, user))
  .catch(err => cb(err));
});


passport.use(
  new LocalStrategy(
    
    {
      usernameField: 'email',
      passwordField: 'password'
    },
    (username, password, done) => {
      User.findOne({ email: username })
      .then( user => {
        if(!user) {
          return done(null, false, { message: 'Incorrect Username' });
        }

        if (!bcrypt.compareSync(password, user.password)) {
          return done(null, false, { message: 'Incorrect password' });
        }

        return done(null, user);

      })
      .catch(err => done(err));
    }
  )
);


passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/signin/google/callback"
    },
    (accessToken, refreshToken, profile, done) => {
      // to see the structure of the data in received response:

      console.log(profile._json)
 
      User.findOne( { googleID: profile.id } )
        .then(user => {
          if (user) {
            done(null, user);
            return;
          }
 
      User.create({ name: profile._json.given_name, email: profile._json.email, googleID: profile.id, verified: true })
          .then(newUser => {
            done(null, newUser);
          })
          .catch(err => done(err)); // closes User.create()
       })
       .catch(err => done(err)); // closes User.findOne()
    }
    
  )
);


app.use(
  session({
  secret: process.env.SESSION_SECRET,
  saveUninitialized: false, 
  resave: true,
  cookie : {
      maxAge: 24*60*60*1000 //in milliseconds
  }, 
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    ttl: 24*60*60 //in seconds = 1day 
  })
}));

app.use(passport.initialize());
app.use(passport.session());



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
