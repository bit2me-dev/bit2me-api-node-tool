/**
 * @author Bit2Me
 * @dev Get KYC link of Bit2Me Embed
 */

// Bit2me logic
const { getEmbedToken } = require('./bit2me_logic/embedAuth');

const args = process.argv.slice(2);
const SUBACCOUNT = args[0]

const kyc = async () => {
    try{
        const token = await getEmbedToken(SUBACCOUNT);
        return (token) ? console.log(`${process.env.EMBED}/kyc/init?t=${token}`) : console.error("Error generating link")
    }
    catch(e){
        console.error(e.response.data)
    }
}

kyc();
