
const express = require('express'),
      path = require('path'),
      app = express(),
      publicPath = path.resolve(__dirname, 'public');

app.use(express.static(publicPath));

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
