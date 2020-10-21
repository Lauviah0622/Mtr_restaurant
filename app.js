const express = require('express');

const app = express();
const bodyParser = require('body-parser');
const session = require('express-session');
const flash = require('connect-flash');
const router = require('./routers');

const port = process.env.PORT || 5501;

app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true,
}));
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
}));
app.use(flash());

app.use(express.static(`${__dirname}/public`));

app.use(router);
app.use((err, req, res, next) => {
  console.log('Error handler: ', err);
  res.send({
    ok: false,
    data: {
      Error: err.message,
    },
  });
  res.end();
});
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
