require('dotenv').config();
const express = require('express');
const app = express();
const ejs = require('ejs');
const expressLayout = require('express-ejs-layouts');
const path = require('path');
const initRoute = require('./routes/web');
const PORT = process.env.PORT || 3000;
const mongoose = require('mongoose');
const sesstion = require('express-session');
const flash = require('express-flash');
const mongoDbStore = require('connect-mongo')(sesstion);

//Database connection
const url = process.env.MONGODB_URI || 'mongodb://localhost/pizza';

mongoose.connect(url, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: true });
const connection = mongoose.connection;
connection.once('open', () => {
    console.log('Database Connected...');
}).catch(err => {
    console.log('Connection failed...');
})

//Session store
let mongoStore = new mongoDbStore({
    mongooseConnection: connection,
    collection: 'sessions'
})

//Session config
app.use(sesstion({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    store: mongoStore,
    cookie: { maxAge: 1000 * 60 * 60 * 24 } //valid for 24hours time 
    //cookie: { maxAge: 1000 * 10 } //valid for 24hours time 
}));


//passport config should be done  after session config
const passport = require('passport');
const initPassport = require('./app/config/passport');
initPassport(passport);
app.use(passport.initialize());
app.use(passport.session());

//express flash

app.use(flash());

//express data middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//global middleware is to used to provide session on html views
app.use((req, res, next) => {
    res.locals.session = req.session;
    res.locals.user = req.user;
    next();
});

//Assets
app.use(express.static('public'));

///set Template engine
app.use(expressLayout);
app.set('views', path.join(__dirname, '/resources/views'));
app.set('view engine', 'ejs');

//this is the route method of web.js
initRoute(app);





app.listen(PORT, () => {
    console.log("Listening on post 3000....");
});