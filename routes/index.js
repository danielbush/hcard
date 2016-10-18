
const router = require('express').Router(),
      render = require('../lib/hcard');

router.get('/', (req, res, next) => {
  res.render('index', {
    hCardData: JSON.stringify(req.user),
    hCard: render(req.user)
  });
});

router.post('/submit', (req, res, next) => {
  req.user.save(req.body, err => {
    if (err) next(err);
    else res.redirect(303, '/');
  });
});

router.post('/update', (req, res, next) => {
  req.user.save(req.body, err => {
    if (err) next(err);
    else res.sendStatus(200);
  });
});

module.exports = router;
