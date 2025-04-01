/**
 * @author Bit2Me
 * @dev Deposit EUR in Bit2Me (bank transfer)
 */
const axios  = require('axios');

// Bit2me logic
const { getAuthHeaders } = require('./bit2me_logic/utils');
const { openWss } = require('./bit2me_logic/ws');
const { getPocket } = require('./utils/getPocket');

const PROFORMA_PATH = process.env.END_TELLER_PROF;
const EXECUTE_PROFORMA_PATH = process.env.END_TELLER_EXEC;

const args = process.argv.slice(2);

const SUBACCOUNT = args[2];
const currency = "EUR";

const depositEUR = async () => {
    const pockets = await getPocket(currency, SUBACCOUNT);
    
    if(pockets.length == 0){
        console.error(`No ${currency} pockets, please use npm run create-pocket ${currency} <name> [subaccount-id]`)
        process.exit(1);
    }

    const pocket = pockets[0].id;

    try{
        const path = `${process.env.END_POCKET_REF}/?pocketId=${pocket}`
        const response = await axios.get(`${process.env.SERVER}${path}`, getAuthHeaders(path, SUBACCOUNT));
        if(response.data){
            console.log(`Now, you can make a secure bank transfer to deposit EUR.`);
            console.log(response.data.bankAccounts)
            console.log("Once the deposit has been received, the execution of this script will be cut off. In case your balance is not credited, please contact the Bit2Me team.")
            
            const successMessage = await openWss(process.env.WS_EUR_DEPOSIT);
            console.log("Transaction successful:", successMessage);
        }
    }catch(e) {
        console.error(e.response.data)
        console.log("\n> Send reqId to Bit2Me team to debug it :)")
        process.exit(1);
    }
}

depositEUR()
