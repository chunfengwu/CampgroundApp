if (process.env.NODE_ENV != "production") {
    require('dotenv').config()
}

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override')
const session = require('express-session')
const flash = require('connect-flash');
const ExpressError = require('./utilies/Expresserror');
const passport = require('passport');
const LocalStrategry = require('passport-local');
const User = require('./models/user');

const userRoutes = require('./routes/users')
const campgroundsRoutes = require('./routes/campgrounds');
const reviewsRoutes = require('./routes/reviews');

mongoose.connect('mongodb://localhost:27017/yelp-camp')
    .then(() => {
        console.log("MONGO CONNECTION OPEN!!!")
    })
    .catch(err => {
        console.log("OH NO MONGO CONNECTION ERROR!!!!")
        console.log(err)
    })

const app = express();

app.engine('ejs', ejsMate);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true })); // parsing the req body
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname, 'public')));


const sessionConfig = {
    secret: 'thisshouldbeabettersecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expire: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
};

app.use(session(sessionConfig));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session()); // make sure passport.session is used after session
//  refer to passport-local-mongoose doc: https://github.com/saintedlama/passport-local-mongoose
passport.use(new LocalStrategry(User.authenticate()));
passport.serializeUser(User.serializeUser()); // how to store a user;
passport.deserializeUser(User.deserializeUser());


// app.use((req, res, next) => {
//     res.locals.success = req.flash('success');
//     next();
// })
app.use((req, res, next) => {
    // conscole.log(req.session);
    // console.log(req.user);
    res.locals.currentUser = req.user; // if user login, user info will be auto saved into req.user. If login, Nav bar will only show logout. If logout, req.user will be undifined;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
}); // has to be positioned before calling the following routes

app.use('/', userRoutes)
app.use('/campgrounds', campgroundsRoutes)
app.use('/campgrounds/:id/reviews', reviewsRoutes)

app.get('/', (req, res) => {
    res.render('home')
});

app.all('*', (req, res, next) => {
    next(new ExpressError('Page not found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) {
        err.message = "something went wrong"
    }
    res.status(statusCode).render('error', { err });
})


app.listen(3000, () => {
    console.log("APP IS LISTENING ON PORT 3000!")
})