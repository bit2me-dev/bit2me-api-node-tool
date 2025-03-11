/**
 * @author Bit2Me
 * @dev Withdraw EUR in Bit2Me
 */
const axios  = require('axios');

// Bit2me logic
const { getAuthHeaders } = require('./bit2me_logic/utils');
const { getPocket } = require('./utils/getPocket');
const { getTx } = require('./utils/getTx');

const PROFORMA_PATH = process.env.END_W_PROFORMA;
const EXECUTE_PROFORMA_PATH = process.env.END_WALLET_TX;

const args = process.argv.slice(2);
if(args.length < 2){
    console.error("Usage: npm run wd-fiat <amount> <TOTP> [subaccount-id]")
    process.exit(1);
}

const currency   = "EUR"
const amount     = args[0]
const totp       = args[1]
const subaccount = args[2]

const withdrawEUR = async () => {
    const pockets = await getPocket(currency, subaccount);

    if(pockets.length == 0){
        console.error(`No ${currency} pockets, please use npm run create-pocket ${currency} <name> [subaccount-id]`)
        process.exit(1);
    }

    const pocket = pockets[0].id;

    //! Fill empty strings with your values
    const proformaBody = {
        "pocket": pocket,
        "amount": amount,
        "currency": currency,
        "type": "SEA",
        "concept": "",
        "note": "",
        "destination": {
            "bankAccount": {
                "bankAccount": "", // <IBAN_bank_account>
                "country": "", // <ISO_3166-2_country_code>
                "receiverName": "",
            }
        },
        "userCurrency": "EUR"
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
                console.log(await getTx(response.data.id, subaccount))
            }
        }
    }catch(e) {
        console.error(e.response.data)
        console.log("\n> Send reqId to Bit2Me team to debug it :)")
        process.exit(1);
    }
}

withdrawEUR()
