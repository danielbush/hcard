/**
 * This middleware is pretending to do what passport is doing by
 * setting req.user.
 */
function makeUser () {

  return function user (req, res, next) {
    req.user = {
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
    next();
  };

};

module.exports = makeUser;
