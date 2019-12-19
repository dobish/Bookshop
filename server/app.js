const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');

const session = require('express-session'); // Only needed for some passport strategies
const checkJwt = require('express-jwt');    // Check for access tokens automatically
const bcrypt = require('bcryptjs');         // Used for hashing passwords!
const jwt = require('jsonwebtoken');

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

/**** Configuration ****/
const port = (process.env.PORT || 8080);
const APP_URL = process.env.APP_URL || 'http://localhost:3000/';
const secret = "the cake is a lie";
const app = express();
app.use(cors());
app.use(bodyParser.json()); // Parse JSON from the request body
app.use(morgan('combined')); // Log all requests to the console
app.use(express.static('../client/build')); // Only needed when running build in production mode
app.use(session({ secret: secret, cookie: { maxAge: 60000 }, resave: false, saveUninitialized: true}));

// Configure Passport
passport.use(new LocalStrategy(
    function(username, password, done) {
        User.findOne({username: username}, (err, user) => {
            if (user) {
                bcrypt.compare(password, user.password, (err, result) => {
                    if (result) {
                        console.log(result)
                        const payload = { username: username };
                        const token = jwt.sign(payload, secret, { expiresIn: '1h' });

                        return done(null, {username: username, token: token, admin: user.admin});
                    }
                    else done(null, false, { message: 'Incorrect username or password.' });
                });
            } else {
                done(null, false, { message: 'User not found' });
            }
        });
    }
));





app.use(passport.initialize());

// Open paths that do not need login. Any route not included here is protected!

// Validate the user using authentication. checkJwt checks for auth token.


// This middleware checks the result of checkJwt
app.use((err, req, res, next) => {
        if (err.name === 'UnauthorizedError') { // If the user didn't authorize correctly
               res.status(401).json({ error: err.message, debug: 'checkJwt' }); // Return 401 with error message.
                //next();
        } else {
                next(); // If no errors, send request to next middleware or route handler
        }
});

/**** Local Users ****/

// It is recommended that you store users in MongoDB using Mongoose instead of this.
const users = [
        // These are just some test users with passwords.
        // The passwords are in clear text for testing purposes. (don't do this in production)
        { id: 0, username: "krdo@eaaa.dk", password: '123'},
        { id: 1, username: "tosk@eaaa.dk", password: 'password'},
        { id: 2, username: "mvkh@eaaa.dk", password: 'l33th0xor'},
];

// Creating more test data: We run through all users and add a hash of their password to each.
// Again, this is only for testing. In practice, you should hash only when adding new users.
users.forEach(user => {
        bcrypt.hash(user.password, 10, function(err, hash) {
                user.hash = hash; // The hash has been made, and is stored on the user object.
                delete user.password; // The clear text password is no longer needed
        });
});



/**** Data ****/
const data = [
        {id: 1, name: "Garfield", hobbies: ["Purring", "Sleeping", "Eating"]},
        {id: 2, name: "Tom", hobbies: ["Purring", "Eating"]},
        {id: 3, name: "Felix", hobbies: ["Sleeping", "Eating"]},
];

/**** Database ****/
// The "Book Data Access Layer".
const categoryDAL = require('./category_dal')(mongoose);

/**** Start ****/
const url = (process.env.MONGO_URL || 'mongodb://localhost/bookstore_db');
mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(async () => {
        // Fill in test data if needed.
        await categoryDAL.bootstrap();

        // Routes
        const categoryRouter = require('./category_router')(categoryDAL);
        app.use('/api/categories', categoryRouter);

        // "Redirect" all get requests (except for the routes specified above) to React's entry point (index.html)
        // It's important to specify this route as the very last one to prevent overriding all of the other routes


            // Users Routes
        const usersRouter = require('./users_router')(users, secret, passport, APP_URL);
        app.use('/api/users', usersRouter);


            app.get('*', (req, res) =>
                res.sendFile(path.resolve('..', 'client', 'build', 'index.html'))
            );

        await app.listen(port); // Start the API
        console.log(`Category API running on port ${port}!`)
    }).catch(error => console.error(error));

/**** Routes ****/
/*const usersRouter = require('./users_router')(users, secret, passport, APP_URL);
app.use('/api/users', usersRouter);

const categories_router = require('./category_router')(data);
app.use('/api/categories', categories_router);

// "Redirect" all get requests (except for the routes specified above) to React's entry point (index.html)
// It's important to specify this route as the very last one to prevent overriding all of the other routes
app.get('*', (req, res) =>
    res.sendFile(path.resolve('..', 'client', 'build', 'index.html'))
);*/





