
// Server-side rendering of hCard.
//
// This could be generalised perhaps.


// Make React global because hCard assumes it.

global.React = require('react');

const React = require('react'),
      ReactDOMServer = require('react-dom/server'),
      hCardComponent = require('../dist/main.js').default,
      hCardElement = React.createFactory(hCardComponent);

module.exports.hCardElement = hCardElement;
module.exports.render = (element) => {
  return ReactDOMServer.renderToString(element);
};
