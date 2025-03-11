/**
 * @author Bit2Me
 * @dev Get market data of one currency in Bit2Me
 */
const axios  = require('axios');

const PATH = process.env.END_MARKET_DATA;
const args = process.argv.slice(2);
if(args.length < 1){
    console.error("Usage: npm run market-data <currency>")
    process.exit(1);
}

const currency = args[0];

const marketQuotes = async () => {
    try {
        const headers = { 
            'Accept-Encoding': 'gzip, deflate, br, zstd' 
        }
        
        const response = await axios.get(`${process.env.SERVER}${PATH}${currency}`, { headers: headers });
        console.log(response.data);
    }
    catch(e) {
        console.error(e.response.data)
        console.log("\n> Send reqId to Bit2Me team to debug it :)")
    }
}

marketQuotes()
