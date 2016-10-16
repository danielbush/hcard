
const getDAO = require('./dao').getDAO;

/**
 * Pretends to get the current logged-in user.
 */
function getCurrentUser () {
  return getDAO().findUserById(1);
}

module.exports.getCurrentUser = getCurrentUser;
