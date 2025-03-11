/**
 * @author Bit2Me
 * @dev Get balance for Bit2Me pockets
 */
const { validate } = require('uuid')

// Bit2me logic
const { getPocket } = require('./utils/getPocket');

const calcBalance = (pockets) => {
    if (pockets.length > 0) {
        console.log(`There are ${pockets.length} pockets\n`);

        const { totalBalance, totalBlockedBalance, totalBlockedOutputBalance } = pockets.reduce((totals, item) => {
            totals.totalBalance += parseFloat(item.balance);
            totals.totalBlockedBalance += parseFloat(item.blockedBalance);
            totals.totalBlockedOutputBalance += parseFloat(item.blockedOutputBalance);
            return totals;
        }, { totalBalance: 0, totalBlockedBalance: 0, totalBlockedOutputBalance: 0 });

        console.log(`Total available balance: ${parseFloat(totalBalance.toFixed(18)).toString()}`);
        console.log(`Total blocked balance: ${parseFloat(totalBlockedBalance.toFixed(18)).toString()}`);
        console.log(`Total blocked output balance: ${parseFloat(totalBlockedOutputBalance.toFixed(18)).toString()}`);
    } else {
        console.error("No pockets");
    }
};

const args = process.argv.slice(2);

const pocketsBalance= async () => {
    let subaccount = args[1]
    let crypto = "";

    if(args[0]){
        if(!validate(args[0])){
            crypto = args[0];
        }
        else{
            subaccount = args[0];
        }
    }
    
    calcBalance(await getPocket(crypto, subaccount))
    
}

pocketsBalance()