/**
 * @author Bit2Me
 * @dev List all available currencies in Bit2Me
 */
const axios = require('axios');

const { getNetworks } = require('./utils/getNetworks');
const { getCurrencyWdInfo } = require('./utils/getCurrencyWdInfo');

const { SERVER, END_CURRENCIES, END_C_SETTINGS } = process.env;

const listCurrencies = async () => {

    try {
        const headers = { 
            'Accept-Encoding': 'gzip, deflate, br, zstd' 
        }

        const [data, datacur, datafee] = await Promise.all([
            axios.get(`${SERVER}${END_CURRENCIES}`, { headers: headers }),
            axios.get(`${SERVER}${END_C_SETTINGS}`, { headers: headers }),
            getCurrencyWdInfo()
        ]);

        const result = Object.fromEntries(
            await Promise.all(
                Object.entries(data.data)
                .filter(([, value]) => !value.removedAt)
                .map(async ([key, value]) => {
                    const networks = await getNetworks(key);
                    const actionsEntry = datacur.data.find((cur) => cur.symbol === key);
                    const feesEntry = datafee.find((fee) => fee.symbol === key);

                    const networksWithFees = networks?.map(network => {
                        const fee = feesEntry?.networks?.find(n => n.networkId === network.id);
                        return (fee) ? {
                            ...network,
                            minimumWithdrawal: fee.minimumWithdrawal || null,
                            withdrawalFee: fee.withdrawalFee || null
                        } : network;
                    });

                    return [
                        key,
                        {
                            ...value,
                            ...(actionsEntry ? { actions: actionsEntry.actions } : {}),
                            networks: networksWithFees,
                        }
                    ];
                })
            ).then(entries => entries.filter(Boolean))
        );

        console.log(JSON.stringify(result, null, 2));
    } catch (e) {
        console.error(e);
        console.log("\n> Send reqId to Bit2Me team to debug it :)");
    }
};

listCurrencies();