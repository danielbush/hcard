
/**
 * An in-memory User model that has a test user (id=1).
 *
 * It represents the interface that is required by this application.
 *
 */

class FakeUser {

  constructor (id, options) {
    if (options.data) {
      for (let key in options.data) {
        if (options.data.hasOwnProperty(key)) {
          this[key] = options.data[key];
        }
      }
    }
    this.id = id;
  }

}

FakeUser.findUserById = function findUserById (id) {

  if (id === 1) {
    return Promise.resolve(new FakeUser(id, {
      data: {
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
      }
    }));
  }
  else {
    return Promise.reject(new Error(`User '${id}' not found.`));
  }

}

module.exports = FakeUser;
