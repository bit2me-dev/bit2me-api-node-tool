/**
 * @author Bit2Me
 * @dev List pockets from Bit2Me
 */
const { validate } = require('uuid')

// Bit2me logic
const { getPocket } = require('./utils/getPocket');

const args = process.argv.slice(2);

const listPockets= async () => {
    let SUBACCOUNT = args[1]
    let crypto = "";

    if(args[0]){
        if(!validate(args[0])){
            crypto = args[0];
        }
        else{
            SUBACCOUNT = args[0];
        }
    }
    
    console.log(await getPocket(crypto, SUBACCOUNT))
}

listPockets()