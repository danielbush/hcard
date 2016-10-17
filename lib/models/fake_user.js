
const _ = require('lodash');

/**
 * An in-memory User model that has a test user (id=1).
 *
 * It represents the interface that is required by this application.
 *
 */

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

const store = {
  1: user1()
};

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
      _.forOwn(changes, (value, key) => {
        this[key] = changes[key];
      });
      Object.assign(store[this.id], changes);
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
