const express = require('express');

const app = express();
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser')
const flash = require('connect-flash');
// const router = ;

const port = process.env.PORT || 5501;

app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true,
}));
app.use(cookieParser())
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
}));
app.use(flash());

app.use(express.static(`${__dirname}/dist`));

// use router

require('./routers')(app);

// err handler
app.use((err, req, res, next) => {
    console.log('Error handler: ', err);
    // res.redirect('/')
    res.end();
});


app.get('*', function(req, res) {
    res.status(404).send('what???');
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});