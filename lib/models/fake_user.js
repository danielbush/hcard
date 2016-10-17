
const _ = require('lodash');

// Fake user data.
const user1 = () => ({
  id: 1,
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

// Memory-based store.
//
// TODO: move this out to share with other models.
// But, we would probably just use a real store like nedb with memory.

const store = {
  1: user1()
};

/**
 * An in-memory User model that has a test user (id=1).
 *
 * It represents the interface that is required by this application.
 *
 */
class FakeUser {

  constructor (id, options) {
    if (store[id]) {
      _.forOwn(store[id], (value, key) => {
        this[key] = value;
      });
    }
    this.id = id;
  }

  save (changes, cb) {
    changes = _.omit(changes, ['id', '_id']);
    process.nextTick(() => {
      // Update the store.
      Object.assign(store[this.id], changes);
      // Update this model instance.
      _.forOwn(changes, (value, key) => {
        this[key] = changes[key];
      });
      cb(null, this);
    });
  }

  static findUserById (id) {

    if (id === 1) {
      return Promise.resolve(new FakeUser(id));
    }
    else {
      return Promise.reject(new Error(`User '${id}' not found.`));
    }

  };

  static reset () {
  };

}


module.exports = FakeUser;
