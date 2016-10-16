
// Sketching other components...

class FakeDAO {

  constructor () {
  }

  findUserById (id) {
    if (id === 1) {
      return Promise.resolve({
        id: id,
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
      });
    }
    else {
      return Promise.reject(new Error(`User '${id}' not found.`));
    }

  }

}

const DAO = new FakeDAO();

function getCurrentUser () {
  return DAO.findUserById(1);
}

/**
 * This middleware is pretending to do what passport is doing by
 * setting req.user.
 */
function makeUser () {

  return function user (req, res, next) {
    let err = null;
    getCurrentUser()
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
