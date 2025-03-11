/**
 * @author Bit2Me
 * @dev Get transactions list from Bit2Me
 */

// Bit2me logic
const { getTx } = require('./utils/getTx')

const args = process.argv.slice(2);

const SUBACCOUNT = args[0]

const listTransactions= async () => {
    console.log(await getTx("", SUBACCOUNT))
}

listTransactions()