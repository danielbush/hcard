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


/**
 * This function pretends to get the current logged-in user.
 */
function getCurrentUser () {
  return DAO.findUserById(1);
}

module.exports.getCurrentUser = getCurrentUser;
