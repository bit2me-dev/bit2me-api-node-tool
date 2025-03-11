/**
 * @author Bit2Me
 * @dev Resource to get embed token
 */
const axios  = require('axios');

// Bit2me logic
const { getAuthHeaders } = require('./utils');

const EMBED = process.env.END_EMBED;
const AUTH = process.env.END_AUTH;

const getEmbedToken = async (subaccount) => {
    const body = (subaccount) ? { 'userId': subaccount } : {};
    const config = getAuthHeaders(EMBED, "", body);

    const response = await axios.post(
        `${process.env.SERVER}${EMBED}`,
        body,
        config
    );

    return (response.status !== 200) ? null : response.data.accessToken.token;
}

const getAuthToken = async (accessToken) => {
    if(!accessToken) return null;

    const body = {
        "accessToken" : accessToken
    }
    const config = getAuthHeaders(AUTH, "", body);

    const response = await axios.post(
        `${process.env.SERVER}${AUTH}`,
        body,
        config
    );

    return (response.status !== 200) ? null : response.data.accessToken.token;

}

module.exports = { getEmbedToken, getAuthToken };
