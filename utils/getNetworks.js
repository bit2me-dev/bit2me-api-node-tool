/**
 * @author Bit2Me
 * @dev Get all available networks for a currency in Bit2Me
 */
const axios  = require('axios');

// Bit2me logic
const { getAuthHeaders } = require('../bit2me_logic/utils');

const getNetworks = async (currency) => {
    if(!currency) return;
    try {
        const path = `${process.env.END_WA_CURRENCY}${currency}/network`;
        const response = await axios.get(`${process.env.SERVER}${path}`, getAuthHeaders(path));
        return response.data;
    } catch {
        return;
    }
}

module.exports = { getNetworks }
