/**
 * @author Bit2Me
 * @dev Get currency config in Bit2Me
 */
const axios  = require('axios');

// Bit2me logic
const { getAuthHeaders } = require('../bit2me_logic/utils');

const getCurrencyWdInfo = async () => {
    try {
        const path = `${process.env.END_CUR_CONFIG}`;
        const response = await axios.get(`${process.env.SERVER}${path}`, getAuthHeaders(path));
        return response.data;
    } catch {
        return;
    }
}

module.exports = { getCurrencyWdInfo }
