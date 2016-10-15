
// Maybe polyfill for react 15 and Object.assign.
//
// object-assign@4.1 will decide if to polyfill or not.
// Also, we need to be using react 15.1+.
// https://github.com/facebook/react/issues/6451#issuecomment-212154690

Object.assign = require('object-assign');

// Make React global because hCard assumes it.
global.React = require('react');

const express = require('express'),
      compression = require('compression'),
      errorhandler = require('errorhandler'),
      path = require('path'),
      logger = require('morgan'),
      routes = require('./routes/index'),
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
    app.use(logger('dev', { skip: (req, res) => (res.statusCode < 400) }));
    break;
  default:
    app.use(logger('combined'));
}

app.use(compression());

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
