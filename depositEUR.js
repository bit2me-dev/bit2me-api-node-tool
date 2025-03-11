/**
 * @author Bit2Me
 * @dev Deposit EUR in Bit2Me with your credit card
 */
const axios  = require('axios');

// Bit2me logic
const { getAuthHeaders } = require('./bit2me_logic/utils');
const { openWss } = require('./bit2me_logic/ws');
const { getPocket } = require('./utils/getPocket');

const PROFORMA_PATH = process.env.END_TELLER_PROF;
const EXECUTE_PROFORMA_PATH = process.env.END_TELLER_EXEC;

const args = process.argv.slice(2);
if(args.length < 2){
    console.error("Usage: npm run deposit-eur <amount> <credit-card-id> [subaccount-id]")
    process.exit(1);
}

const SUBACCOUNT = args[2]
const currency = "EUR";

const depositEUR = async () => {
    const pockets = await getPocket(currency, SUBACCOUNT);
    
    if(pockets.length == 0){
        console.error(`No ${currency} pockets, please use npm run create-pocket ${currency} <name> [subaccount-id]`)
        process.exit(1);
    }

    const pocket = pockets[0].id;
    const amount = args[0]
    const creditCard = args[1]

    const proformaBody = {
        "orderType": "deposit",
        "amount" : amount,
        "currency" : currency,
        "method": {
            "type": "creditcard",
            "params": {
                "cardId": creditCard
            }
        },
        "destination": {
            "type": "pocket",
            "value": pocket
        }
    }

    try{
        const proformaResponse = await axios.post(
            `${process.env.SERVER}${PROFORMA_PATH}`,
            proformaBody,
            getAuthHeaders(PROFORMA_PATH, SUBACCOUNT, proformaBody)
        );
    
        if(proformaResponse.data){
            const orderId = proformaResponse.data.orderId;
            const execBody = {
                "orderId": orderId
            }

            const response = await axios.post(
                `${process.env.SERVER}${EXECUTE_PROFORMA_PATH}`,
                execBody,
                getAuthHeaders(EXECUTE_PROFORMA_PATH, SUBACCOUNT, execBody)
            );

            if(response.data) {
                console.log(`Deposit pending. Go to ${response.data.provider.requestConfiguration.uri} and complete the process.` )
                
                // Open wss listening successuly EUR deposit
                const successMessage = await openWss(process.env.WS_EUR_DEPOSIT)
                console.log("Transaction successful:", successMessage);
            }
        }
    }catch(e) {
        console.error(e.response.data)
        console.log("\n> Send reqId to Bit2Me team to debug it :)")
        process.exit(1);
    }
}

depositEUR()
