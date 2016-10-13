
const express = require('express'),
      React = require('react'),
      ReactDOMServer = require('react-dom/server'),
      compression = require('compression'),
      path = require('path'),
      app = express(),
      publicPath = path.resolve(__dirname, 'public'),
      cssPath = path.resolve(__dirname, 'public', 'css'),
      imgPath = path.resolve(__dirname, 'public', 'img'),
      distPath = path.resolve(__dirname, 'dist');

// Make React global because hCard assumes it.
global.React = React;

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

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
