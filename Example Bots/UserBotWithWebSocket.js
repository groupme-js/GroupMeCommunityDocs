/**
 * This is an example bot that uses the WebSocket interface to subscribe to all chats for a user
 * and respond to the '!ping' command with 'pong'.
 *
 *This code was adapted from the
 * node-groupme(https://github.com/groupme-js/node-groupme/blob/main/src/util/Websocket.ts) library by
 * not-so-smart(https://github.com/not-so-smart)
 */

import WebSocket from 'ws';
import EventEmitter from 'events';
import fetch from 'node-fetch';

let request_id = 1;
let client_id;
const user_id = '{user_id}'; // replace with your user id
const access_token = '{access_token}'; // replace with your access token

const ws = new WebSocket('wss://push.groupme.com/faye');
const channels = new EventEmitter()

/**
 * Send handshake on connection to the WebSocket server
 */
ws.on('open', () => {
    handshake();
});

/**
 *  The request to subscribe to the /meta/handshake channel is sent by the handshake() function.
 *  This function takes the client_id from the server and stores it and calls the subscribe() function.
 */
channels.once('/meta/handshake', (data) => {
    client_id = data.clientId;
    subscribe(`/user/${user_id}`);
})

/**
 * Once the subscription is received from the server, call the connect function;
 */
channels.once('/meta/subscribe', () => {
    connect();
})

/**
 * Reconnect when prompted by the server
 */
channels.on('/meta/connect', () => {
    connect();
})

/**
 * Parse the messages from the WebSocket server
 */
ws.on('message', data => handle(data));

/**
 * On messages to the /user/{user_id} channel, check if the message is a incoming GroupMe message and if so, respond
 */
channels.on(`/user/${user_id}`, (data) => {
    const message_type = data['data']['type'];
    if (message_type === 'line.create') {
        const message = data['data']['subject']['text'];
        const group_id = data['data']['subject']['group_id'];
        if (message.toLowerCase() === '!ping') {
            send_message(`Pong!`, group_id);
        }
    }
})

/**
 * Parse the messages from the WebSocket server and emit it to the proper channel
 *
 * @param data
 */
const handle = (data) => {
    const parsed = JSON.parse(data.toString())[0];
    channels.emit(parsed.channel, parsed);
}

/**
 * Send the handshake request to the WebSocket server
 */
const handshake = () => {
    send({
        channel: '/meta/handshake',
        version: '1.0',
        supportedConnectionTypes: ['websocket'],
    });
};

/**
 * Send the subscribe request to the WebSocket server for the given channel
 *
 * @param channel
 */
const subscribe = (channel) => {
    send({
        channel: '/meta/subscribe',
        subscription: channel,
        ext: {access_token: access_token},
    })
};

/**
 * Send the connect request to the WebSocket server
 */
const connect = () => {
    send({
        channel: '/meta/connect',
        connectionType: 'websocket',
    })
};

/**
 * Send a message to the WebSocket server
 *
 * @param data
 */
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

/**
 * Send a message to the GroupMe group specified by the group_id
 *
 * @param message
 * @param group_id
 */
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
