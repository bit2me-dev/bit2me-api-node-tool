/**
 * @author Bit2Me
 * @dev Access Bit2Me with JWT
 */

// Bit2me logic
const { getAuthToken, getEmbedToken } = require('./bit2me_logic/embedAuth');

const args = process.argv.slice(2);
const SUBACCOUNT = args[0]

const getJWT = async () => {
    try{
        const embed = await getEmbedToken(SUBACCOUNT);
        
        if(embed){
            const jwt = await getAuthToken(embed);
            (jwt) ? console.log(`Your JWT is: ${jwt}\n\nYou can decode it by pasting it here: https://jwt.io/`) : console.log("Something went wrong. Please try again.");
        }
    }
    catch(e){
        console.error(e.response.data)
        console.log("\n> Send reqId to Bit2Me team to debug it :)")
    }
}

getJWT();
