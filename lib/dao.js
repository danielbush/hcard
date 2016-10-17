
const FakeUser = require('./models/fake_user');

function getUserDao () {
  switch (process.env.NODE_ENV) {
    default:
      return FakeUser;
  }
}

module.exports.getUserDao = getUserDao;
