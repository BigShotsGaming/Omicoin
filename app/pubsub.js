const PubNub = require('pubnub');

const credentials = {
    publishKey: 'pub-c-9f225349-97f9-4b3c-ba64-b590c2c39bec',
    subscribeKey: 'sub-c-7369d462-cca5-11eb-a9cc-a6433017f026',
    secretKey: 'sec-c-MmIyNmU0YzktYTA5OS00NWRjLWEyNjYtZTFkNjUzODIwZjAx'
};

const CHANNELS = {
    TEST: 'TEST',
    BLOCKCHAIN: 'BLOCKCHAIN'
};

class PubSub {
    constructor(blockchain) {
        this.blockchain = blockchain;
        this.pubnub = new PubNub(credentials);

        this.pubnub.subscribe({ channels: Object.values(CHANNELS) });
        this.pubnub.addListener(this.listener());
    }

    broadcastChain() {
        this.publish({
          channel: CHANNELS.BLOCKCHAIN,
          message: JSON.stringify(this.blockchain.chain)
        });
    }

    subscribeToChannels() {
        this.pubnub.subscribe({
          channels: [Object.values(CHANNELS)]
        });
    }

    listener(){
        return{
            message: messageObject => {
                const { channel, message } = messageObject;
                console.log(`Message Received. Channel: ${channel}. Message: ${message}`);

                const parsedMessage = JSON.parse(message);
                if(channel === CHANNELS.BLOCKCHAIN) {
                    this.blockchain.replaceChain(parsedMessage);
                }
            }
        };
    }

    publish({ channel, message }){
        this.pubnub.publish({ channel, message });
    }
}

module.exports = PubSub;