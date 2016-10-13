
const express = require('express'),
      React = require('react'),
      ReactDOMServer = require('react-dom/server'),
      compression = require('compression'),
      errorhandler = require('errorhandler'),
      path = require('path'),
      logger = require('morgan'),
      app = express(),
      publicPath = path.resolve(__dirname, 'public'),
      cssPath = path.resolve(__dirname, 'public', 'css'),
      imgPath = path.resolve(__dirname, 'public', 'img'),
      distPath = path.resolve(__dirname, 'dist');

const loggerType = (app.get('env') === 'development') ? 'dev' : 'combined';

// Make React global because hCard assumes it.
global.React = React;

app.use(logger(loggerType));
app.use(compression());
app.use('/css', express.static(cssPath));
app.use('/img', express.static(imgPath));
app.use(express.static(distPath));

app.get('/', (req, res) => {
  res.sendFile(path.resolve(publicPath, 'index.html'), (err) => {
    if (err) {
      res.status(err.status).end();
    }
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

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
