
const dao = require('./dao');
const User = dao.getUserDao();

/**
 * Pretends to get the current logged-in user.
 */
function getCurrentUser () {
  return User.findUserById(1);
}

module.exports.getCurrentUser = getCurrentUser;
