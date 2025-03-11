/**
 * @author Bit2Me
 * @dev Social pay
 */
const axios  = require('axios');
const { validate } = require('uuid');

// Bit2me logic
const { getAuthHeaders } = require('./bit2me_logic/utils');
const { getPocket } = require('./utils/getPocket');
const { getTx } = require('./utils/getTx');
const { openWss } = require('./bit2me_logic/ws');
const { getUser } = require('./utils/getUser');
const { isSubaccount } = require('./utils/isSubaccount');

const SOCIAL_PATH = process.env.END_SOCIAL_PAY;

const args = process.argv.slice(2);

const usage = () => {
    console.error("Usage: npm run pay <amount> <crypto> <alice> <bob> <alice-TOTP>")
    process.exit(1);
}

if(args.length < 5){ usage(); }

const amount    = args[0]
const crypto    = args[1]
let   alice     = args[2]
let   bob       = args[3]
const totp      = args[4]

const socialPay = async () => {
    if(!validate(alice) || !validate(bob)) usage();

    alice = (await isSubaccount(alice)) ? alice : "";
    bob = (await isSubaccount(bob)) ? bob : "";

    const pockets = await getPocket(crypto, alice);

    if(pockets?.length == 0){
        console.error(`No ${crypto} pockets, please use npm run create-pocket ${crypto} <name> [subaccount-id]`)
        process.exit(1);
    }

    const pocket = pockets[0].id;
    const bobAlias = await getUser("alias", bob);

    if(!bobAlias) {
        console.error(`Please, set an alias for ${bob}. Execute npm run set-alias <alias> ${bob}`);
        process.exit(1);
    }

    const body = {
        "amount": amount,
        "currency": crypto,
        "pocketId": pocket,
        "type": "alias",
        "alias": bobAlias,
        "note": `Social pay between ${(alice == "") ? "main" : alice} and ${(bob == "") ? "main" : bob}`
    }

    try{
        const config = getAuthHeaders(SOCIAL_PATH, alice, body);
        
        // Add TOTP headers
        config.headers['x-totp'] = totp;
        config.headers['x-totp-type'] = 'gauth';
        
        const response = await axios.post(
            `${process.env.SERVER}${SOCIAL_PATH}`,
            body,
            config
        )

        const successMessage = await openWss(process.env.WS_SOCIALPAY_SUCCESS);
        console.log("Transaction successful:", successMessage);

        const transactionInfo = await getTx(response.data.walletMovementId, alice);
        console.log("Transaction details:", transactionInfo);
    }
    catch(e){
        console.error(e.response.data);
        console.log("\n> Send reqId to Bit2Me team to debug it :)")
        process.exit(1);
    }
}

socialPay()
