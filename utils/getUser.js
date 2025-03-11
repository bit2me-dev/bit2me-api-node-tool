/**
 * @author Bit2Me
 * @dev Get user details Bit2Me
 */
const axios  = require('axios');

// Bit2me logic
const { getAuthHeaders } = require('../bit2me_logic/utils');

const PATH = process.env.END_ACCOUNT;

const getUser = async (data, subaccount) => {
    try {
        const response = await axios.get(`${process.env.SERVER}${PATH}`, getAuthHeaders(PATH, subaccount));
        return (data) ? response.data[data] : response.data;
    } catch {
        return;
    }
}

module.exports = { getUser }
