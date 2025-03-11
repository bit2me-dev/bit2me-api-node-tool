/**
 * @author Bit2Me
 * @dev List all cryptocurrencies Bit2Me quotes in the selected currency
 */
const axios  = require('axios');

const PATH = process.env.END_QUOTES;
const args = process.argv.slice(2);

const DEFAULT = "EUR"
const currency = (args[0]) ? args[0] : DEFAULT;

const marketQuotes = async () => {
    try {
        const headers = { 
            'Accept-Encoding': 'gzip, deflate, br, zstd' 
        }

        const response = await axios.get(`${process.env.SERVER}${PATH}?currency=${currency}`, { headers: headers });
        console.log(response.data);
    }
    catch(e) {
        console.error(e.response.data)
        console.log("\n> Send reqId to Bit2Me team to debug it :)")
    }
}

marketQuotes()
