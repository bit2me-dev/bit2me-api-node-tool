/**
 * @author Bit2Me
 * @dev Checks if account is subaccount
 */

// Bit2me logic
const { getUser } = require('./getUser');

const isSubaccount = async (account) => {
    try {
        return !!(await getUser("email", account));
    } catch {
        return;
    }
}

module.exports = { isSubaccount }
