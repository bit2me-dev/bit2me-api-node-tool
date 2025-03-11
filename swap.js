/**
 * @author Bit2Me
 * @dev Swap crypto in Bit2Me
 */
const axios  = require('axios');

// Bit2me logic
const { getAuthHeaders } = require('./bit2me_logic/utils');
const { getPocket } = require('./utils/getPocket');
const { getTx } = require('./utils/getTx');

const PROFORMA_PATH = process.env.END_W_PROFORMA;
const EXECUTE_PROFORMA_PATH = process.env.END_WALLET_TX;

const args = process.argv.slice(2);

if(args.length < 3){
    console.error("Usage: npm run swap <amount> <crypto-origin> <crypto-destination> [subaccount-id]");
    process.exit(1);
}

const AMOUNT = args[0];
const ORIGIN = args[1];
const DESTINATION = args[2];
const SUBACCOUNT = args[3];

const retrievePockets = async () => {
    const originPockets = await getPocket(ORIGIN, SUBACCOUNT);
    const destinationPockets = await getPocket(DESTINATION, SUBACCOUNT);

    if(originPockets.length == 0){
        console.error(`No ${ORIGIN} pockets, please use npm run create-pocket ${ORIGIN} <name> [subaccount-id]`)
        process.exit(1);
    }

    if(destinationPockets.length == 0){
        console.error(`No ${DESTINATION} pockets, please use npm run create-pocket ${DESTINATION} <name> [subaccount-id]`)
        process.exit(1);
    }

    return [originPockets[0].id, destinationPockets[0].id]
}


const swap = async () => {
    const [origin, destination] = await retrievePockets();

    let proformaBody = {
        "pocket": origin,
        "destination": {
            "pocket": destination,
        },
        "amount": AMOUNT,
        "currency": ORIGIN
    };

    try{
        const proformaResponse = await axios.post(
            `${process.env.SERVER}${PROFORMA_PATH}`,
            proformaBody,
            getAuthHeaders(PROFORMA_PATH, SUBACCOUNT, proformaBody)
        );

        if(proformaResponse.data){
            const orderId = proformaResponse.data.id;
            const execBody = {
                "proforma": orderId
            }

            const response = await axios.post(
                `${process.env.SERVER}${EXECUTE_PROFORMA_PATH}`,
                execBody,
                getAuthHeaders(EXECUTE_PROFORMA_PATH, SUBACCOUNT, execBody)
            );

            if (response.data) {
                console.log(await getTx(response.data.id, SUBACCOUNT))
            }
        }
    }catch(e) {
        console.error(e.response.data)
        console.log("\n> Send reqId to Bit2Me team to debug it :)")
    }
}

swap()
