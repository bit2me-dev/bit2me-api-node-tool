/**
 * @author Bit2Me
 * @dev Withdraw crypto in Bit2Me
 */
const axios  = require('axios');

// Bit2me logic
const { getAuthHeaders } = require('./bit2me_logic/utils');
const { getPocket } = require('./utils/getPocket');
const { getNetworks } = require('./utils/getNetworks');
const { getTx } = require('./utils/getTx');

const PROFORMA_PATH = process.env.END_W_PROFORMA;
const EXECUTE_PROFORMA_PATH = process.env.END_WALLET_TX;
const TRAVEL_RULE_INFO = process.env.END_TRAVEL_RULE;

const args = process.argv.slice(2);
if(args.length < 5){
    console.error("Usage: npm run wd-crypto <amount> <crypto> <network> <address> <TOTP> [subaccount-id]")
    process.exit(1);
}

const amount     = args[0]
const crypto     = args[1]
const network    = args[2]
const address    = args[3]
const totp       = args[4]
const subaccount = args[5]

const withdrawCrypto = async () => {
    const [pockets, networks] = await Promise.all([
        getPocket(crypto, subaccount),
        getNetworks(crypto)
    ]);

    if(pockets.length == 0){
        console.error(`No ${crypto} pockets, please use npm run create-pocket ${crypto} <name> [subaccount-id]`)
        process.exit(1);
    }

    const pocket = pockets[0].id;
    const hasNet = networks.some(net => net.id === network);

    if(!hasNet){
        console.error(`${crypto} doesn't have network ${network} available`);
        process.exit(1);
    }

    const proformaBody = {
        "pocket": pocket,
        "currency": crypto,
        "amount": amount,
        "type" : "REA",
        "destination": {
            "address": address,
            "network": network
        }
    }

    try{
        const proformaResponse = await axios.post(
            `${process.env.SERVER}${PROFORMA_PATH}`,
            proformaBody,
            getAuthHeaders(PROFORMA_PATH, subaccount, proformaBody)
        );

        if(proformaResponse.data){
            const orderId = proformaResponse.data.id;
            const execBody = {
                "proforma": orderId
            }

            const config = getAuthHeaders(EXECUTE_PROFORMA_PATH, subaccount, execBody)
            
            // Add TOTP headers
            config.headers['x-totp'] = totp;
            config.headers['x-totp-type'] = 'gauth';

            const response = await axios.post(
                `${process.env.SERVER}${EXECUTE_PROFORMA_PATH}`,
                execBody,
                config
            );

            if (response.data) {
                // Travel Rule
                const trBody = {
                    "walletType": "unhosted",
                    "walletOwnership": "own"
                }
                const trPath = TRAVEL_RULE_INFO + response.data.id;

                const trResponse = await axios.post(
                    `${process.env.SERVER}${trPath}`,
                    trBody,
                    getAuthHeaders(trPath, subaccount, trBody)
                );

                if (trResponse) {
                    console.log(await getTx(response.data.id, subaccount))
                }
            }
        }
    }catch(e) {
        console.error(e.response.data)
        console.log("\n> Send reqId to Bit2Me team to debug it :)")
        process.exit(1);
    }
}

withdrawCrypto()
