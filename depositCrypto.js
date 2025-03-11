/**
 * @author Bit2Me
 * @dev Deposit crypto in Bit2Me from blockchain
 */
const axios  = require('axios');

// Bit2me logic
const { getAuthHeaders } = require('./bit2me_logic/utils');
const { openWss } = require('./bit2me_logic/ws');
const { getPocket } = require('./utils/getPocket');
const { getNetworks } = require('./utils/getNetworks');

const args = process.argv.slice(2);
if(args.length < 2){
    console.error("Usage: npm run deposit-crypto <crypto> <network> [subaccount-id]")
    process.exit(1);
}

const crypto = args[0];
const network = args[1];
const SUBACCOUNT = args[2];

const depositCrypto = async () => {
    const [pockets, networks] = await Promise.all([
        getPocket(crypto, SUBACCOUNT),
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

    try{
        const path = `${process.env.END_POCKET_DEP}/?network=${network}&walletPocketId=${pocket}`
        const response = await axios.get(`${process.env.SERVER}${path}`, getAuthHeaders(path, SUBACCOUNT));
        if(response.data && response.data.length == 1){
            console.log(`Now, you can make a secure ${crypto} deposit using the ${network} network to this address: ${response.data[0].address} .\nOnce the deposit has been received, the execution of this script will be cut off. In case your balance is not credited, please contact the Bit2Me team.`);
            
            // Open wss listening successuly `crypto` deposit
            const successMessage = await openWss(process.env.WS_CRY_SUC_DEPOSIT);
            console.log("Transaction successful:", successMessage);
        }
    }
    catch(e){
        console.error(e.response.data)
        console.log("\n> Send reqId to Bit2Me team to debug it :)")
        process.exit(1);
    }
}

depositCrypto()
