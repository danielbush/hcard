
const router = require('express').Router(),
      React = require('react'),
      ReactDOMServer = require('react-dom/server'),
      hCardComponent = React.createFactory(require('../dist/main.js').default);

router.get('/', (req, res, next) => {

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

  res.render('index', {
    hCard: ReactDOMServer.renderToString(hCardComponent(hCardProps))
  });

});

module.exports = router;
