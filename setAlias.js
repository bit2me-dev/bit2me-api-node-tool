/**
 * @author Bit2Me
 * @dev Set alias for an account in Bit2Me
 */
const axios  = require('axios');

// Bit2me logic
const { getAuthHeaders } = require('./bit2me_logic/utils');

const GET_ALIAS_AVAILABILITY = process.env.END_CHECK_ALIAS;
const SET_ALIAS_PATH = process.env.END_UPDATE_AC;

const args = process.argv.slice(2);
if(args.length < 1){
    console.error("Usage: npm run set-alias <alias> [subaccount-id]")
    process.exit(1);
}

const ALIAS = args[0]
const SUBACCOUNT = args[1]

const setAlias = async () => {
    try {
        const availability = await axios.get(
            `${process.env.SERVER}${GET_ALIAS_AVAILABILITY + ALIAS}`,
            getAuthHeaders(GET_ALIAS_AVAILABILITY + ALIAS, SUBACCOUNT)
        );

        if(availability.data.available){
            const body = {
                "alias" : ALIAS
            }

            const response = await axios.put(
                `${process.env.SERVER}${SET_ALIAS_PATH}`,
                body,
                getAuthHeaders(SET_ALIAS_PATH, SUBACCOUNT, body)
            );
      
            console.log(response.data);
        }
        else{
            console.error("Alias not available");
        }
    }
    catch(e) {
        console.error(e.response.data)
        console.log("\n> Send reqId to Bit2Me team to debug it :)")
    }
}

setAlias()
