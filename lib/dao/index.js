
// Get the DAO (data access object) that we will use to get data from
// a store.
//
// We can specify which DAO to use here based on NODE_ENV.

module.exports.getDAO = function getDAO () {
  let DAO = null;
  switch (process.env.NODE_ENV) {
    default:
      DAO = require('./fake_dao');
      break;
  }
  return new DAO();
};
