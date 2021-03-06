
const auth = require('../auth');

/**
 * This middleware is pretending to do what passport is doing by
 * setting req.user.
 */
function makeUser () {

  return function user (req, res, next) {
    let err = null;
    auth.getCurrentUser()
      .then(user => {
        req.user = user;
        next();
      })
      .catch(err => {
        err = new Error('Not Authenticated');
        err.status = 401;
        next(err);
      });
  };

};

module.exports = makeUser;
