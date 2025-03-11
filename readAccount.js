/**
 * @author Bit2Me
 * @dev Get an account in Bit2Me
 */
const axios  = require('axios');

// Bit2me logic
const { getAuthHeaders } = require('./bit2me_logic/utils');

const PATH = process.env.END_ACCOUNT;
const ID_PATH = process.env.END_ID_ACCOUNT;

const args = process.argv.slice(2);
const SUBACCOUNT = args[0]

const readAccount = async () => {
    try {
        const [user, identity] = await Promise.all([
            axios.get(
                `${process.env.SERVER}${PATH}`,
                getAuthHeaders(PATH, SUBACCOUNT)
            ),
            axios.get(
                `${process.env.SERVER}${ID_PATH}`,
                getAuthHeaders(ID_PATH, SUBACCOUNT)
            )
        ]);

        const response = {
            ...user.data,
            ...identity.data
        };

        console.log(response)
    }
    catch(e) {
        console.error(e.response.data)
        console.log("\n> Send reqId to Bit2Me team to debug it :)")
    }
}

readAccount()
