# Push Service (WebSockets)

The GroupMe Push Service is strange and finicky, so giving precise documentation about it is hard. 
It's built off of [Faye](https://faye.jcoglan.com/browser/subscribing.html), a relatively simple pub/sub websocket messaging protocol. 
You may want to read its docs for a deeper understanding of how it works.
The [official documentation](https://dev.groupme.com/tutorials/push) has some outdated and incomplete information,
it may be hard to figure out what's required and what's not.

Here is a list of some known WebSocket types and what they correspond to:

* `ping` -> A ping from the web socket server
* `line.create` -> New Group Message. This includes anything that makes a message such as calendar events,
  joining/leaving events, polls, etc.
* `like.create` -> Someone likes a message that is yours in a group
* `favorite` -> Someone likes a message that is not yours in a group (can not be caught in the `/user/:user_id` channel, only in group or direct_message channels)
* `direct_message.create` -> New Direct Message
* `message.deleted` -> A message was deleted
***

## Push Channel Types

WebSocket messages sent downstream to clients are divided into three different kinds of channels, each with its own respective context and message types.

The most useful channel by far is `/user/:user_id`, which sends down messages on new events that any client will send you push notifications about. 
(e.g., new messages in groups you're a part of or reactions attached to messages you have sent).

The other two less important channel types are `/groups/:group_id`, and `/direct_message/:dm_id`. 
Both send information about specific channels that a client wouldn't need to send push notifications for but would need to render the channel when it's open correctly and on the screen. 
(e.g., typing indicators, new reactions attached to other messages in the channel that you have not sent, or even membership and role updates for specific users)

## Subscribing to the `/user/:user_id` channel

By far the simplest option for establishing a websocket connection is to use a Faye library to handle the boilerplate and manage connections for you.
Here's how you'd do it in node.js using both the `faye`, and `axios` npm packages:

```
npm i faye axios
```

```js
const faye = require('faye');       // manages the websocket connection for getting real-time updates from groupme.
const axios = require('axios');     // used for making REST API calls.
const events = require('events');   // allows us to create and emit events to drive functions.

// the event object that will trigger on each new ws message.
const ws = new events.EventEmitter;

const main = async (GroupmeAPItoken) => {

    // use the rest API to grab your user ID in order to authenticate with the websocket.
    let me = await axios.get(`https://api.groupme.com/v3/users/me?token=${GroupmeAPItoken}`);
    let user_id = me.data.response.user_id;

    // start the websocket.
    let client = new faye.Client("https://push.groupme.com/faye");

    // adds your API credentials to any 'subscribe' request sent to groupme.
    client.addExtension({ 
        outgoing: (msg, callback) => {
            if (msg.channel !== '/meta/subscribe') return callback(msg);
            msg.ext = msg.ext || {};
            msg.ext.access_token = GroupmeAPItoken;
            msg.ext.timestamp = Math.round(Date.now() / 1000);
            callback(msg);
        }
    });

    // subscribe to the '/user/:user_id' channel.
    client.subscribe(`/user/${user_id}`, (msg) => { 
        ws.emit('message', msg);
    });
}

// this function will run EVERY TIME a new websocket 
// message is sent to the '/user/<your_user_id>' channel.
ws.on('message', (msg) => {
    console.log(msg);
});

// start the websocket connection. (plug your own API token in here).
main("YOUR_GROUPME_API_TOKEN");
```
Feel free to adapt this code to suit your needs.
***

## Subscribing to ALL channels

This step is usually overkill, but for those who are interested in catching group or channel-specific updates, 
like typing indicators or reactions to messages that aren't your own, you may want to try subscribing to all or some
of these extra channels.

We can modify the above script to subscribe to channels other than `/user/:user_id` by adding this block of code to the bottom of its `main()` function:

```js
const main = async (GroupmeAPItoken) => {

    // (. . . The rest of main() goes here . . .)

    let groups = await axios.get(`https://api.groupme.com/v3/memberships/states?token=${GroupmeAPItoken}`);
    groups = groups.data.response;
    for (let i = 0; i < groups.length; i++) {
        if (groups[i].state === "active") {
            // subscribe to '/group/:group_id' for this group channel.
            client.subscribe(`/group/${groups[i].group_id}`, (msg) => { 
                ws.emit('message', msg);
            });
        }
    }

    let dms = await axios.get(`https://api.groupme.com/v3/chats?token=${GroupmeAPItoken}`);
    dms = dms.data.response;
    for (let i = 0; i < dms.length; i++) {
        // subscribe to '/direct_message/:dm_id' for this DM channel.
        // note that for some wierd reason, the REST API puts a '+' between the two 
        // user IDs to denote the conversation ID but websockets use an underscore instead.
        client.subscribe(`/direct_message/${dms[i].conversation_id.replace("+", "_")}`, (msg) => { 
            ws.emit('message', msg);
        });
    }

}
```

The full script for subscribing to every availible WebSocket channel would look like this:

```js
const faye = require('faye');       // manages the websocket connection for getting real-time updates from groupme.
const axios = require('axios');     // used for making REST API calls.
const events = require('events');   // allows us to create and emit events to drive functions.

// the event object that will trigger on each new ws message.
const ws = new events.EventEmitter;

const main = async (GroupmeAPItoken) => {

    // use the rest API to grab your user ID in order to authenticate with the websocket.
    let me = await axios.get(`https://api.groupme.com/v3/users/me?token=${GroupmeAPItoken}`);
    let user_id = me.data.response.user_id;

    // start the websocket.
    let client = new faye.Client("https://push.groupme.com/faye");

    // adds your API credentials to any 'subscribe' request sent to groupme.
    client.addExtension({ 
        outgoing: (msg, callback) => {
            if (msg.channel !== '/meta/subscribe') return callback(msg);
            msg.ext = msg.ext || {};
            msg.ext.access_token = GroupmeAPItoken;
            msg.ext.timestamp = Math.round(Date.now() / 1000);
            callback(msg);
        }
    });

    // subscribe to the '/user/:user_id' channel.
    client.subscribe(`/user/${user_id}`, (msg) => { 
        ws.emit('message', msg);
    });

    let groups = await axios.get(`https://api.groupme.com/v3/memberships/states?token=${GroupmeAPItoken}`);
    groups = groups.data.response;
    for (let i = 0; i < groups.length; i++) {
        if (groups[i].state === "active") {
            // subscribe to '/group/:group_id' for this group channel.
            client.subscribe(`/group/${groups[i].group_id}`, (msg) => { 
                ws.emit('message', msg);
            });
        }
    }

    let dms = await axios.get(`https://api.groupme.com/v3/chats?token=${GroupmeAPItoken}`);
    dms = dms.data.response;
    for (let i = 0; i < dms.length; i++) {
        // subscribe to '/direct_message/:dm_id' for this DM channel.
        // note that for some wierd reason, the REST API puts a '+' between the two 
        // user IDs to denote the conversation ID but websockets use an underscore instead.
        client.subscribe(`/direct_message/${dms[i].conversation_id.replace("+", "_")}`, (msg) => { 
            ws.emit('message', msg);
        });
    }
}

// this function will run EVERY TIME a new websocket message 
// is sent to the user, group, or direct message channels.
ws.on('message', (msg) => {
    console.log(msg);
});

// start the websocket connection. (plug your own API token in here).
main("YOUR_GROUPME_API_TOKEN");
```
***

## Other Implementations
For those curious here are some other working implementations beyond the scope of the example posted in these docs:

* [My bot, Lowes.](https://github.com/2CATteam/gmuserbot/blob/master/bot.js) I'm sure I stole this working code from
  somewhere, but I can't for the life of me figure out where.

* [groupme_push](https://github.com/cuuush/groupme-push), a GroupMe push implementation in Python. 

* [The GroupMe npm package](https://github.com/njoubert/node-groupme/blob/master/lib/IncomingStream.js)
