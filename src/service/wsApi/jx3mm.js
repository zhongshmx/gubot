const websocket = require('../websocket');

class Jx3mm{
    ws;
    handleMessageStack;

    constructor(env, name) {
        this.ws = new websocket(env.jx3mm_websocket_url, name)
        let jx3mm = this;
        this.ws.handleOpen.push(async function() {
            jx3mm.send(`WEB:${env.jx3mm_account}\tFYH:\tZone:电信五区\tSrv:唯我独尊`);
        });
        // this.ws.handleOpen.push(async function() {
        //     jx3mm.send(`WEB:${env.jx3mm_account}\tFYH:\tZone:电信五区\tSrv:唯我独尊`);
        // });
        this.handleMessageStack = this.ws.handleMessageStack;
    }

    send(data){
        this.ws.send(data);
    }
}

module.exports = Jx3mm;
