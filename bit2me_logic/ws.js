// Bit2me logic
const { getEmbedToken, getAuthToken } = require('./embedAuth');

const WebSocket = require("ws")

let ws;
let reconnectInterval = 1000; // 1"
let maxReconnectInterval = 30000; // 30"
let reconnectAttempts = 0;

const openWss = async (action = "listen") => {
    return new Promise((resolve, reject) => {
        if(ws) ws.close();
    
        ws = new WebSocket(process.env.WSS);
        
        ws.addEventListener ('error', err => {
            console.error ('websocket error:', err);
            reject(err);
        });
        
        ws.addEventListener ('open', async () => {
            ////TRACE: console.log("wss connected");
            reconnectAttempts = 0;
            try{
                const embed = await getEmbedToken();
                if(!embed) return ;
                ws.send (JSON.stringify ({ type: 'authenticate', payload: { token: await getAuthToken(embed) }}));
            }
            catch(e){
                console.error(e.response.data);
                reject(e);
            }
        });
        
        ws.addEventListener ('message', message => {
            const msg = JSON.parse(message.data);
    
            //! Uncomment the following line for better debugging process
            // console.log (`websocket message: type: ${msg.type}, id: ${msg.id}, time: ${new Date().toLocaleString('es-ES', { timeZone: 'UTC' })} UTC`);
            // if(msg.type !== 'currency.rates' && msg.type !== 'earn-current-apys.change') {
            //     console.log(msg.payload)
            // }
    
            if(msg.type === action){
                ws.close();
                resolve(msg.type);
            }
        });
        
        ws.addEventListener ('close', evt => {
            if (evt.code === 4000) {
                console.log (`Error while authenticating: ${evt.code}/${evt.reason}`);
                reject(new Error(`Authentication error: ${evt.reason}`));
            }
            else if (evt.code === 4001) {
                console.log (`Error rate limit: ${evt.code}/${evt.reason}`);
                handleReconnect(action);
            }
        });
    });
}

const handleReconnect = (action) => {
    reconnectAttempts++;
    ////TRACE: console.log(`trying to reconnect... (attempt ${reconnectAttempts})`);

    reconnectInterval = Math.min(reconnectInterval * 2, maxReconnectInterval);

    setTimeout(() => {
        openWss(action);
    }, reconnectInterval);
}

module.exports = { openWss }