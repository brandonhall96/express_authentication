require('dotenv').config();
const express = require('express');
const layouts = require('express-ejs-layouts');
const app = express();
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('./config/ppConfig');


const SECRET_SESSION = process.env.SECRET_SESSION //we run a secret session kind of as a door we know whos coming in or made a request


app.set('view engine', 'ejs');

app.use(require('morgan')('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/public'));
app.use(layouts);
app.use(session({
  secret: SECRET_SESSION,    // What we actually will be giving the user on our site as a session cookie
  resave: false,             // Save the session even if it's modified, make this false
  saveUninitialized: true    // If we have a new session, we save it, therefore making that true
}));
app.use(flash());            // flash middleware

app.use((req, res, next) => { //req is a request, res is a render
  console.log(res.locals);       //for every response there is a local key that we can store objects in
  res.locals.alerts = req.flash(); // attach an alert to the key and it will flash a message
  res.locals.currentUser = req.user; // put current user in as well so we always know who the user is
  next(); // after this go to the next function
});
app.use(passport.initialize());      // Initialize passport
app.use(passport.session());         // Add a session



app.get('/', (req, res) => {
  res.render('index');
});

app.get('/profile', (req, res) => {
  res.render('profile');
});

app.use('/auth', require('./controllers/auth'));


const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`🎧 You're listening to the smooth sounds of port ${PORT} 🎧`);
});

module.exports = server;
