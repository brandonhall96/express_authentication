const passport = require('passport'); 
const LocalStrategy = require('passport-local').Strategy;

const db = require('../models'); // just connecting our db

const STRATEGY = new LocalStrategy({
    usernameField: 'email',             // looks for an email field as the username
    passwordField: 'password'           // looks for an password field as the password
}, async (email, password, cb) => {
    try {
        const user = await db.user.findOne({
            where: { email }
        });

        if (!user || !user.validPassword(password)) { //if not user password will return false but we make true 'yes the password is incorrect
            cb(null, false);    // if no user or invalid password, return false
        }
        else {
            cb(null, user);
        }
    }

        catch (err) {
            console.log('------Error below-----------')
            console.log(err)
        }
});

// Passport "serialize" info to be able to login
passport.serializeUser((user, cb) => { // serialize a user using id
    cb(null, user.id)
});

passport.deserializeUser(async(id, cb) => { //deserialize using id
    try {
        const user = await db.user.findByPk(id) //db => user => primary key (id)

        if (user) {
            cb(null, user)  //cb is taking the include data and taking it to the next thing
        }
    }
    catch (err) {
        console.log('--------Henlo am an error---------')
        console.log(err)
    }
});

passport.use(STRATEGY); //middleware

module.exports = passport;


//this is all to go into our database and check and do these
//middleware is just functions manipulating data before redirecting to new page