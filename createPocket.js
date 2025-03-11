/**
 * @author Bit2Me
 * @dev Create pocket in Bit2Me
 */
const axios  = require('axios');

// Bit2me logic
const { getAuthHeaders } = require('./bit2me_logic/utils');

const PATH = process.env.END_POCKET;

const args = process.argv.slice(2);
if(args.length < 2){
    console.error("Usage: npm run create-pocket <currency> <name> [subaccount-id]")
    process.exit(1);
}

const SUBACCOUNT = args[2]

const createPocket = async () => {
    try {
        const body = { 'currency' : args[0], 'name': args[1]}
        
        const response = await axios.post(
            `${process.env.SERVER}${PATH}`,
            body,
            getAuthHeaders(PATH, SUBACCOUNT, body)
        );
        console.log(response.data);
    }
    catch(e) {
        console.error(e.response.data)
        console.log("\n> Send reqId to Bit2Me team to debug it :)")
    }
}

createPocket()
