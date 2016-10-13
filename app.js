
const express = require('express'),
      React = require('react'),
      ReactDOMServer = require('react-dom/server'),
      compression = require('compression'),
      path = require('path'),
      app = express(),
      publicPath = path.resolve(__dirname, 'public'),
      distPath = path.resolve(__dirname, 'dist');

// Make React global because hCard assumes it.
global.React = React;

app.use(compression());
app.use(express.static(publicPath));
app.use(express.static(distPath));

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
