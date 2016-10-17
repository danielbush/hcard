
const router = require('express').Router(),
      React = require('react'),
      ReactDOMServer = require('react-dom/server'),
      hCardComponent = React.createFactory(require('../dist/main.js').default);

router.get('/', (req, res, next) => {

  res.render('index', {
    hCardData: JSON.stringify(req.user),
    hCard: ReactDOMServer.renderToString(hCardComponent(req.user))
  });

});

router.post('/submit', (req, res, next) => {
  req.user.save(req.body, err => {
    if (err) next(err);
    else res.redirect(303, '/');
  });
});

module.exports = router;
