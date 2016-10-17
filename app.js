
// Maybe polyfill Object.assign.
//
// object-assign@4.1 will decide if to polyfill or not in node.
// Also, we need to be using react 15.1+.
// https://github.com/facebook/react/issues/6451

Object.assign = require('object-assign');


const express = require('express'),
      compression = require('compression'),
      errorhandler = require('errorhandler'),
      bodyParser = require('body-parser'),
      //multer = require('multer'),
      path = require('path'),
      logger = require('morgan'),
      routes = require('./routes/index'),
      user = require('./lib/middleware/user'),
      app = express(),
      viewsPath = path.resolve(__dirname, 'views'),
      publicPath = path.resolve(__dirname, 'public'),
      cssPath = path.resolve(__dirname, 'public', 'css'),
      imgPath = path.resolve(__dirname, 'public', 'img'),
      distPath = path.resolve(__dirname, 'dist');

// Views

app.set('views', path.join(viewsPath));
app.set('view engine', 'ejs');

// Logging

switch (app.get('env')) {
  case 'development':
    app.use(logger('dev'));
    break;
  case 'test':
    // So that test output isn't cluttered.
    app.use(logger('dev', { skip: (req, res) => true }));
    break;
  default:
    app.use(logger('combined'));
}

app.use(compression());

// Handle application/x-www-form-urlencoded.

app.use(bodyParser.urlencoded({ extended: true }));

//app.use(multer({ dest: 'uploads/' }).single('avatar'));

// Set req.user so we can get user details.
//
// We're pretending to be passport here.

app.use(user());

// Static paths

app.use('/css', express.static(cssPath));
app.use('/img', express.static(imgPath));
app.use(express.static(distPath));

app.use(routes);

// Dev error handler.

if (app.get('env') === 'development') {
  app.use(errorhandler());
}

// Default error handler.

else {
  app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: {}
    });
  });
}

module.exports = app;
