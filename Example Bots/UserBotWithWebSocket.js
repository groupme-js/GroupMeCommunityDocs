import WebSocket from 'ws';
import EventEmitter from 'events';
import fetch from 'node-fetch';

let request_id = 1;
let client_id;
const user_id = '{user_id}';
const access_token = '{access_token}';

const ws = new WebSocket('wss://push.groupme.com/faye');
const channels = new EventEmitter()

ws.on('open', () => {
    handshake();
});

ws.on('message', data => handle(data));

channels.once('/meta/handshake', (data) => {
    client_id = data.clientId;
    subscribe(`/user/${user_id}`);
})

channels.once('/meta/subscribe', () => {
    connect();
})

channels.on('/meta/connect', () => {
    connect();
})

channels.on(`/user/${user_id}`, (data) => {
    console.log(data);
    const message = data['data']['subject']['text'];
    const group_id = data['data']['subject']['group_id'];
    if (message.toLowerCase() === '!ping') {
        send_message(`Pong!`, group_id);
    }
})

const handle = (data) => {
    const parsed = JSON.parse(data.toString())[0];
    channels.emit(parsed.channel, parsed);
}

const handshake = () => {
    send({
        channel: '/meta/handshake',
        version: '1.0',
        supportedConnectionTypes: ['websocket'],
    });
};

const subscribe = (channel) => {
    send({
        channel: '/meta/subscribe',
        subscription: channel,
        ext: {access_token: access_token},
    })
};

const connect = () => {
    send({
        channel: '/meta/connect',
        connectionType: 'websocket',
    })
};

const send = (data) => {
    data.id = request_id++;
    data.clientId = client_id;
    const str = JSON.stringify([data]);

    ws.send(str, err => {
        if (err) {
            console.error('An error occurred while trying to send:', data);
            throw err;
        }
    })
}

const send_message = (message, group_id) => {
    const headers = {'Content-Type': 'application/json'}
    const body = JSON.stringify(
        {
            message: {
                source_guid: Date.now(),
                text: message
            }
        });
    fetch(`https://api.groupme.com/v3/groups/${group_id}/messages?token=${access_token}`, {
        method: 'POST',
        headers: headers,
        body: body
    }).catch(err => {
        console.error('An error occurred while trying to send:', err);
    })
}
