
// Maybe polyfill for react 15 and Object.assign.
//
// object-assign@4.1 will decide if to polyfill or not.
// Also, we need to be using react 15.1+.
// https://github.com/facebook/react/issues/6451#issuecomment-212154690

Object.assign = require('object-assign');

const express = require('express'),
      React = require('react'),
      ReactDOMServer = require('react-dom/server'),
      compression = require('compression'),
      errorhandler = require('errorhandler'),
      path = require('path'),
      logger = require('morgan'),
      app = express(),
      viewsPath = path.resolve(__dirname, 'views'),
      publicPath = path.resolve(__dirname, 'public'),
      cssPath = path.resolve(__dirname, 'public', 'css'),
      imgPath = path.resolve(__dirname, 'public', 'img'),
      distPath = path.resolve(__dirname, 'dist');

// Make React global because hCard assumes it.
global.React = React;

app.set('views', path.join(viewsPath));
app.set('view engine', 'ejs');

// Logging.

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
app.use('/css', express.static(cssPath));
app.use('/img', express.static(imgPath));
app.use(express.static(distPath));

const hCardComponent = React.createFactory(require('./dist/main.js').default);
const hCardProps = {
  givenName: 'Sam',
  surname: 'Fairfax',
  email: 'sam.fairfax@fairfaxmedia.com.au',
  phone: '0292822833',
  houseNumber: '100',
  street: 'Harris Street',
  suburb: 'Pyrmont',
  state: 'NSW',
  postcode: '2009',
  country: 'Australia'
};

app.get('/', (req, res) => {
  res.render('index', {
    hCard: ReactDOMServer.renderToString(hCardComponent(hCardProps))
  });
});


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
