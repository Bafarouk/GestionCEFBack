const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');
const passport = require('passport');

// LOCAL STRATEGY
passport.use('local',new LocalStrategy({
}, async (username, password, done) => {
    try {
        // Find the user given the email
        const user = await User.findOneByLogin(username);

        // If not, handle it
        if (!user) {
            return done(null, false);
        }

        // Check if the password is correct
        const isMatch = await User.isValidPassword(user,password);
        // If not, handle it
        if (!isMatch) {
            return done(null, false);
        }

        // Otherwise, return the user
        done(null, user);
    } catch(error) {
        done(error, false);
    }
}));