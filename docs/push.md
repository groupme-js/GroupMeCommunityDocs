---
title: "Websocket Gateway"
description: "Learn how to interact with GroupMe's Websocket Gateway via the API."
---

# WebSockets Overview

GroupMe’s real-time messaging is powered by a [Faye-based Bayeux WebSocket protocol](https://faye.jcoglan.com/browser/subscribing.html). Clients subscribe to various channels and receive structured push messages.

GroupMe's [official documentation](https://dev.groupme.com/tutorials/push) has some outdated and incomplete information, but it may be helpful to read alongside these docs.

WebSocket messages sent downstream to clients are divided into three channels, each with its own respective context and message types.

The most useful channel is `/user/:user_id`, which sends messages about new events that any client will send you push notifications about. 
(e.g., new messages in groups you're a part of or reactions attached to messages you have sent).

The other two less important channel types are `/groups/:group_id`, and `/direct_message/:dm_id`. 
Both send information about specific channels that a client wouldn't need to send push notifications for but would need to render the channel when it's open correctly and on the screen. 
(e.g., typing indicators, new reactions attached to other messages in the channel that you have not sent, or even membership and role updates for specific users)

Faye/Bayeux WebSocket clients exist in many languages ([JavaScript](https://www.npmjs.com/package/faye), [Ruby](https://rubygems.org/gems/faye-websocket/versions/0.10.4?locale=en), [Python](https://github.com/dkmadigan/python-bayeux-client), etc.), or you can implement the protocol manually.

For verbosity, we outline how to authenticate and connect using a Faye client library, in pure WebSockets (in case you don't have access to a library), and finally in pure HTTP to do manual long-polling.

***

## Option 1: Using a Faye client (Recommended)

Start by initiating a connection with GroupMe's Faye server:
```js linenums="1"
const faye = require('faye');
const client = new faye.Client("https://push.groupme.com/faye");
```

Next, we need to tell our Client to add our GroupMe API token to any subsequent subscription requests and subscribe to the main user channel:
```js linenums="1"
// add your API credentials to outgoing WebSocket messages
client.addExtension({ 
  outgoing: (msg, callback) => {
    msg.ext = msg.ext || {};
    msg.ext.access_token = "<YOUR GROUPME API ACCESS TOKEN>";
    msg.ext.timestamp = Math.round(Date.now() / 1000);
    callback(msg);
 }
});

// subscribe to the '/user/:user_id' channel.
client.subscribe("/user/<YOUR GROUPME USER ID>", msg => { 
  /* Callback to run when a message is received */
});
```

> [!IMPORTANT]
> The `timestamp` parameter is in *seconds* since the Unix epoch, not milliseconds.

Finally, we subscribe to any other channels we need to:

> [!TIP]
> This step is *usually* overkill. Almost all important real-time updates will come through the `/user/:user_id` channel. You will need to subscribe to individual groups or direct message channels if you want to catch read receipts or certain admin events.

```js linenums="1"
client.subscribe("/group/<GROUP ID> OR /direct_message/<DIRECT MESSAGE CHANNEL ID>", (msg) => { 
  /* Callback to run when a message is received */
});
```

> [!IMPORTANT]
> Direct Message channel IDs are reported within the REST API looking something like `74938777+93645911`, two user IDs separated with a `+`. However, for whatever reason, the WebSocket server only accepts DM channel IDs when they are separated using an underscore (`_`). Make sure to find and replace these symbols before attempting to subscribe to those channels.

***

## Option 2: Pure WebSockets

If you're not using a Faye client library, you can still connect to GroupMe’s real-time Push Service by directly implementing the Bayeux protocol over WebSockets. This approach is transport-agnostic and works in any language that supports WebSockets and JSON.

> For complex steps (like subscription formatting), we’ll show JavaScript snippets to help illustrate what your code might look like.

**Step 1: Perform the Handshake (via HTTP)**

Before opening a WebSocket, you must perform an initial handshake via HTTP to receive a `clientId`. This is a one-time HTTP POST request to the Bayeux endpoint.

Send a JSON array with a channel of `/meta/handshake`, the Bayeux version, and the supported connection types. You must include `"websocket"` in `supportedConnectionTypes`.

```json linenums="1"
POST https://push.groupme.com/faye
[
 {
    "channel": "/meta/handshake",
    "version": "1.0",
    "supportedConnectionTypes": ["websocket"],
    "id": "1"
 }
]
```

GroupMe will respond with a `clientId`, which you'll use for all future messages. The response also includes a list of supported transport types (confirm `"websocket"` is included), and an `advice` object for reconnection behavior.

**Step 2: Open a WebSocket to the Push Server**

Once you’ve received a valid `clientId`, initiate a WebSocket connection to:

```json linenums="1"
wss://push.groupme.com/faye
```

After connecting, begin sending JSON-encoded Bayeux messages directly over the socket.

**Step 3: Start the `/meta/connect` Loop**

Immediately after connecting, send a `/meta/connect` message to initiate the message delivery loop. This step essentially "registers" your client as ready to receive pushes.

```json linenums="1"
{
  "channel": "/meta/connect",
  "clientId": "<YOUR CLIENT ID>",
  "connectionType": "websocket",
  "id": "2"
}
```

This message must be sent repeatedly after each `/meta/connect` response — think of it as polling, but over a persistent socket.

In JavaScript, this could look like:

```js linenums="1"
const connect = () => {
  socket.send(JSON.stringify({
    channel: "/meta/connect",
    clientId, // <YOUR CLIENT ID>
    connectionType: "websocket",
    id: nextMessageId()
 }));
};
```

The server will respond with `successful: true` and may include an `advice` field specifying a `timeout` or `interval` before the next call.

**Step 4: Subscribe to Channels**

To receive push notifications, you must subscribe to the appropriate channel(s). Most useful real-time events will come through `/user/:user_id`.

Subscriptions require authentication: you must include your GroupMe API access token and a Unix timestamp (in seconds) in the `ext` field.

```json linenums="1"
{
  "channel": "/meta/subscribe",
  "clientId": "<YOUR CLIENT ID>",
  "subscription": "/user/<YOUR GROUPME USER ID>", // alternatively, any other channel you'd like to subscribe to
  "id": "3",
  "ext": {
    "access_token": "<YOUR API TOKEN>",
    "timestamp": 1715700000
 }
}
```

In JavaScript, constructing this might look like:

```js linenums="1"
const subscribe = (channel) => {
  socket.send(JSON.stringify({
    channel: "/meta/subscribe",
    clientId,
    subscription: channel,
    id: nextMessageId(),
    ext: {
      access_token: GROUPME_ACCESS_TOKEN, // <YOUR GROUPME API ACCESS TOKEN>
      timestamp: Math.floor(Date.now() / 1000)
 }
 }));
};

subscribe(`/user/${GROUPME_USER_ID}`); // <YOUR GROUPME USER ID>
```

**Step 5: Listen for Messages**

All incoming WebSocket messages will be JSON arrays of Bayeux-style messages. Each one will include:

* A `channel`
* A `data` payload
* and potentially some metadata, like `id` or `clientId`

  
Example incoming message:

```json linenums="1"
{
  "channel": "/user/185",
  "data": {
    "type": "line.create",
    "subject": { 
  "name": "Andygv",
     "avatar_url":null,
     "location": { "name": null, "lng": null,"foursquare_checkin": false,"foursquare_venue_id": null,"lat": null},
     "created_at": 1322557919,
     "picture_url": null,
     "system": false,
     "text": "hey",
     "group_id": "1835",
     "id": "15717",
     "user_id": "162",
     "source_guid": "GUID 13225579210290"
  },
  "alert": "Andygv: hey"
},
"clientId": "1lhg38m0sk6b63080mpc71r9d7q1",
"id": "4uso9uuv78tg4l7csica1kc4c",
"authenticated": true
}
```

In JS, you'd handle this with something like:

```js linenums="1"
socket.onmessage = (event) => {
  const messages = JSON.parse(event.data);
  for (const message of messages) {
    if (message.channel.startsWith("/user/")) {
      handleUserMessage(message.data);
 }
 }
};
```

**Step 6: Maintain the Connection Loop**

The `/meta/connect` message must be sent repeatedly. This acts as a heartbeat and delivery mechanism for future messages.

Follow the `advice.interval` and `advice.timeout` values returned in `/meta/connect` responses to avoid premature disconnection.

**Optional: Subscribing to Group or DM Channels**

You can also subscribe to `/group/:group_id` and `/direct_message/:direct_message_id` channels to get additional channel-specific messages that wouldn't usually buzz your phone, like typing indicators.

To do this: repeat step 4 as many times as necessary, setting the `subscription` parameter to whatever channel you're interested in.

> [!IMPORTANT]
> Please note that when subscribing to DM channels, you must replace the `+` in the conversation ID (as it appears in the REST API) with an `_` instead. We're not entirely sure why this inconsistency exists, but it does.

***

## Option 3: Manual Long-Polling over HTTP (Not Recommended, but still possible)

Start by establishing a connection with GroupMe's Faye server.

Send a POST request to `https://push.groupme.com/faye`. It should look like this:

```json linenums="1"
POST https://push.groupme.com/faye
[
 {
    "channel":"/meta/handshake",
    "version":"1.0",
    "supportedConnectionTypes":["long-polling"],
    "id":"1"
 }
]
```

The response should look something like:
```json linenums="1"
[
 {
    "id": "1",
    "channel": "/meta/handshake",
    "successful": true,
    "version": "1.0",
    "supportedConnectionTypes": ["long-polling","cross-origin-long-polling","callback-polling","websocket","in-process"],
    "clientId": <IMPORTANT CLIENT ID>,
    "advice": {"reconnect":"retry","interval":0,"timeout":30000}
 }
]
```

Note the `clientId` value we've just received, as we will need it in the next step.

In order to subscribe to channels we need to send another POST request with the following body, inserting the `ClientId` value we got from the last request in step one.

```json linenums="1"
POST https://push.groupme.com/faye
[
 {
    "channel": "/meta/subscribe",
    "clientId": <CLIENT ID>,
    "subscription": "/user/<YOUR GROUPME USER ID>",
    "id": "2",
    "ext":
 {
        "access_token": "<YOUR GROUPME API ACCESS TOKEN>",
        "timestamp": <CURRENT TIMESTAMP>
 }
 }
]
```

> [!IMPORTANT]
> 1. The `id` parameter should increment with each successive call to the server. Not doing so may lead to undefined behavior.
>
> 2. The `timestamp` parameter is in seconds since the Unix epoch. Divide whatever timestamp you have by 1000.

GroupMe's response should look something like this:

```json linenums="1"
[
 {
    "id": "2",
    "clientId": <CLIENT ID>,
    "channel": "/meta/subscribe",
    "successful": true,
    "subscription": "/user/<YOUR GROUPME USER ID>"
 }
]
```

> [!TIP]
> This step is *usually* overkill. Almost all important real-time updates will come through the `/user/:user_id` channel. You will need to subscribe to individual groups or direct message channels if you want to catch read receipts or certain admin events.

The POST request for subscribing to a specific channel looks like this (Note that it is basically exactly the same except for a different subscription channel):

```json linenums="1"
POST https://push.groupme.com/faye
[
 {
    "channel": "/meta/subscribe",
    "clientId": <CLIENT ID>,
    "subscription": "/group/<GROUP ID>" OR "/direct_message/<DIRECT MESSAGE CHANNEL ID>",
    "id": "2",
    "ext": {
      "access_token": "<YOUR GROUPME API ACCESS TOKEN>",
      "timestamp": <CURRENT TIMESTAMP>
 }
 }
]
```

> [!IMPORTANT]
> Direct Message channel IDs are reported within the REST API looking something like `74938777+93645911`, two user IDs separated with a `+`. However, for whatever reason, the WebSocket server only accepts DM channel IDs when they are separated using an underscore (`_`). Make sure to find and replace these symbols before attempting to subscribe to those channels.

This step is already handled for you by most Faye libraries. However, if you're doing this manually via HTTP and not WebSockets, you will need to manually check for updates from the Faye server.

```json linenums="1"
POST https://push.groupme.com/faye
[
 {
    "channel": "/meta/connect",
    "clientId": <CLIENT ID>,
    "connectionType": "long-polling",
    "id": "3"
 }
]
```

If GroupMe has nothing to report, it will respond with an array of placeholder objects for each of the channels you're subscribed to. That would look something like this:

```json linenums="1"
[
 {
    "id": "4",
    "clientId": <CLIENT ID>,
    "channel": "/meta/connect",
    "successful": true,
    "advice": {"reconnect":"retry","interval":0,"timeout":30000}
 },
 {
    "channel": "/user/<YOUR GROUPME USER ID>",
    "data": {"ping":true},
    "clientId": <CLIENT ID>,
    "id": "5",
    "ext": {"access_token":"<access token>","timestamp":1322557872},
    "authenticated": true
 }
]
```

If there is something to report, GroupMe will respond with something that might look like this:

```json linenums="1"
[
 {
    "id": "5",
    "clientId": <CLIENT ID>,
    "channel": "/meta/connect",
    "successful": true,
    "advice": {"reconnect":"retry","interval":0,"timeout":30000}
 },
 {
    "channel": "/user/<YOUR GROUPME USER ID>",
    "data": {
      "type": "line.create",
      "subject": {
        "name":"Andygv",
        "avatar_url":null,
        "location": { "name": null, "lng": null,"foursquare_checkin": false,"foursquare_venue_id": null,"lat": null},
        "created_at": 1322557919,
        "picture_url": null,
        "system": false,
        "text": "hey",
        "group_id": "1835",
        "id": "15717",
        "user_id": "162",
        "source_guid": "GUID 13225579210290"
 },
      "alert": "Andygv: hey"
 },
    "clientId": <CLIENT ID>,
    "id": "4uso9uuv78tg4l7csica1kc4c",
    "authenticated":true
 }
]
```

***

## WebSocket Message Structure

When your client is connected to the GroupMe WebSocket server and subscribed to channels, you will receive messages. These messages follow the Bayeux protocol, and the core information is typically found within the data object of the incoming Faye message.

The most important field within data is data.type, which indicates the kind of event that has occurred.

```json linenums="1"
// General structure of an incoming Faye message
{
  "channel": "/user/:your_user_id" || "/group/:group_id" || "/direct_message/:direct_message_id",
  "clientId": "Faye client ID", // this was documented in the steps for connecting to the websocket above
  "id": "Incrementing Faye message ID",
  "data": {
  "type": "ping" || "line.create" || "like.create" etc...,
  // The rest of the data object. These properties depend on the `type` parameter
  }
}
```

***

## Incoming WebSocket Object Types

***

## `ping`
  
A keep-alive message. This message is sent down every 30 seconds in order to ensure your client is still listening. You can generally ignore these messages but they can be useful to measure timing and API responsiveness.

```json linenums="1" title="Data Object Structure"
{
	"type": "ping"
}
```

*  *type*
  
  string - Must be `ping`.

***

## `line.create`

A message was sent in a channel you participate in. This is the most common type of message, and includes many events that normally send system messages (like member join/leave events). More on events can be found [here](events.md).

Generally, incoming messages will look like this:

```json linenums="1" title="Data Object Structure"
{
  "type": "line.create",
  "alert": "Isaac: hi",
  "subject": {
  	"attachments": [],
  	"avatar_url": "https://i.groupme.com/200x200.jpeg.94e0ac5891aa4e6f8ad4bbf961defe4d",
  	"created_at": 1751412575,
  	"deleted_at": null,
  	"deletion_actor": null,
  	"group_id": "108466446",
  	"id": "175141257527047935",
  	"location": {
  		"lat": "",
  		"lng": "",
  		"name": null
  	},
  	"name": "Isaac",
  	"parent_id": null,
  	"picture_url": null,
  	"pinned_at": null,
  	"pinned_by": null,
  	"sender_id": "93645911",
  	"sender_type": "user",
  	"source_guid": "155641929db154909fabf69e089abee8",
  	"system": false,
  	"text": "hi",
  	"updated_at": null,
  	"user_id": "93645911"
  },
  "received_at": 1751412575000
}
```

*  *type*

  string - Must be `line.create`.

*  *alert*

  string - The text that would usually populate the push notification preview.

*  *subject*

  object - The message object this push is refering to.

*  *received_at*

  number - the timestamp corresponding to when the notification was sent.

However, in some cases you may observe a system message with an attached `subject.event` property. These events are documented [here](events.md).

```json linenums="1" title="Data Object Structure"
{
  "type": "line.create",
  "alert": "Isaac pinned a message.",
  "subject": {
  	"attachments": [],
  	"avatar_url": null,
  	"created_at": 1751412698,
  	"deleted_at": null,
  	"deletion_actor": null,
  	"event": {
  		"data": {
  			"message_id": "175141257527047935",
  			"pinned": true,
  			"pinned_at": 1751412698,
  			"pinned_by": "93645911"
  		},
  		"type": "message.pinned"
  	},
  	"group_id": "108466446",
  	"id": "175141269858473080",
  	"location": {
  		"lat": "",
  		"lng": "",
  		"name": null
  	},
  	"name": "GroupMe",
  	"parent_id": null,
  	"picture_url": null,
  	"pinned_at": null,
  	"pinned_by": null,
  	"sender_id": "system",
  	"sender_type": "system",
  	"source_guid": "758ae1503901013e92837e6b6e4b8e5c",
  	"system": true,
  	"text": "Isaac pinned a message.",
  	"updated_at": null,
  	"user_id": "system"
  },
  "received_at": 1751412698000
}
```

*  *type*

  string - Must be `line.create`.

*  *alert*

  string - The text that would usually populate the push notification preview.

*  *subject*

  object - The message object this push is refering to.

*  *received_at*

  number - the timestamp corresponding to when the notification was sent.

***

## `direct_message.create`

`line.create`, but for received DMs.

Generally, incoming messages will look like this:

```json linenums="1" title="Data Object Structure"
{
  "type": "direct_message.create",
  "alert": "Isaac: hola",
  "subject": {
  	"attachments": [],
  	"avatar_url": "https://i.groupme.com/860x861.jpeg.fcb7431eeb94483fa3826a6b835e653a",
  	"chat_id": "93645911+131245991",
  	"created_at": 1751409577,
  	"favorited_by": [],
  	"id": "175140957719383985",
  	"location": {
  		"lat": "",
  		"lng": "",
  		"name": null
  	},
  	"name": "Isaac",
  	"picture_url": null,
  	"recipient_id": "93645911",
  	"sender_id": "131245991",
  	"sender_type": "user",
  	"source_guid": "F7DD8CA8-2040-4AEC-A256-6517885C15B6",
  	"text": "hola",
  	"user_id": "131245991"
  },
  "received_at": 1751409577000
}
```

*  *type*

  string - Must be `direct_message.create`.

*  *alert*

  string - The text that would usually populate the push notification preview.

*  *subject*

  object - The message object this push is refering to.

*  *received_at*

  number - the timestamp corresponding to when the notification was sent.

However, in some cases you may observe a system message with an attached `subject.event` property. These are documented [here](events.md).

```json linenums="1" title="Data Object Structure"
{
  "type": "direct_message.create",
  "alert": "GroupMe: Sprocket pinned a message.",
  "subject": {
  	"attachments": [],
  	"avatar_url": "",
  	"chat_id": "93645911+131245991",
  	"created_at": 1751409766,
  	"event": {
  		"data": {
  			"message_id": "175140957719383985",
  			"pinned": true,
  			"pinned_at": 1751409766,
  			"pinned_by": "131245991"
  		},
  		"type": "message.pinned"
  	},
  	"favorited_by": [],
  	"id": "175140976659243172",
  	"location": {
  		"lat": "",
  		"lng": "",
  		"name": null
  	},
  	"name": "GroupMe",
  	"picture_url": null,
  	"recipient_id": "93645911",
  	"sender_id": "system",
  	"sender_type": "system",
  	"source_guid": "a1f05c4038fa013e78660e75d9c623fa",
  	"text": "Sprocket pinned a message.",
  	"user_id": "system"
  },
  "received_at": 1751409766000
}
```

*  *type*

  string - Must be `line.create`.

*  *alert*

  string - The text that would usually populate the push notification preview.

*  *subject*

  object - The message object this push is refering to.

*  *received_at*

  number - the timestamp corresponding to when the notification was sent.

***

## `membership.create`

Fired when you're added to a group.

```json linenums="1" title="Data Object Structure"
{
  "type": "membership.create",
  "alert": "You've been added to \"test\" with Sprocket.",
  "subject": {
  	"avatar_url": null,
  	"created_at": 1751412192,
  	"creator_id": "131245991",
  	"description": "",
  	"disable_sharing": false,
  	"id": "108466446",
  	"max_memberships": 5000,
  	"name": "test",
  	"phone_number": "+1 7606593055",
  	"preview_url": null,
  	"share_url": "https://groupme.com/join_group/108466446/jkjhwsch",
  	"shared": null,
  	"theme_name": null,
  	"thread_id": null,
  	"type": "private",
  	"updated_at": 1751412305
  },
  "received_at": 1751412305000
}
```

*  *type*

  string - Must be `membership.create`.

*  *alert*

  string - The text that would usually populate the push notification preview.

*  *subject*

  object - A cut down group object describing the group that you've joined.

*  *received_at*

  number - the timestamp corresponding to when the notification was sent.

***

## `favorite`

Someone reacted to a message. This message is also sent when someone removes a reaction from a message.

```json linenums="1" title="Data Object Structure"
{
  "type": "favorite",
  "alert": "",
  "subject": {
    "line": {
      "attachments": [],
      "avatar_url": "https://i.groupme.com/200x200.jpeg.94e0ac5891aa4e6f8ad4bbf961defe4d",
      "created_at": 1751412575,
      "favorited_at": 1751412810,
      "favorited_by": [
  	    "93645911",
  	    "131245991"
      ],
      "group_id": "108466446",
      "id": "175141257527047935",
      "location": {
  	    "lat": "",
  	    "lng": "",
  	    "name": null
      },
      "name": "Isaac",
      "picture_url": null,
      "source_guid": "155641929db154909fabf69e089abee8",
      "system": false,
      "text": "hi",
      "user_id": "93645911"
    },
    "reactions": [
      {
  	    "code": "❤️",
  	    "type": "unicode",
  	    "user_ids": [
  		    "131245991",
  		    "93645911"
  	    ]
      }
    ],
    "user_id": "131245991"
  },
  "received_at": 1751412810000
}
```

*  *type*

  string - Must be `favorite`.

*  *alert*

  string - The text that would usually populate the push notification preview. In this case, there is no text, so `alert` will always be an empty string.

*  *subject.line*

  object - The message being reacted to.

*  *subject.reactions*

  array - A list of reaction objects currently tied to the message.

*  *received_at*

  number - the timestamp corresponding to when the notification was sent.


***

## `message.deleted`

A message was deleted. This type is limited to group or direct message channels where the deletion was observed, however it is always paired with a corresponding `line.create` message containing a `message.deleted` message event that can be caught from the main user channel.

```json linenums="1" title="Data Object Structure"
{
  "type": "message.deleted",
	"alert": "",
	"subject": {
		"attachments": [],
		"avatar_url": "https://i.groupme.com/860x860.jpeg.fcb7431eeb94483fa3356a6b835e653a",
		"created_at": 1751413125,
		"deleted_at": "2025-07-01T23:40:22.8912Z",
		"deletion_actor": "sender",
		"group_id": "108466446",
		"id": "175141312593142427",
		"location": {
			"lat": "",
			"lng": "",
			"name": null
		},
		"name": "Sprocket",
		"parent_id": null,
		"picture_url": null,
		"pinned_at": null,
		"pinned_by": null,
		"sender_id": "131245991",
		"sender_type": "user",
		"source_guid": "A4382407-B41B-43DD-8942-98E7FE9F132A",
		"system": false,
		"text": "This message was deleted",
		"updated_at": null,
		"user_id": "131245991"
	},
	"received_at": 1751413222000
}
```

*  *type*

  string - Must be `message.deleted`.

*  *alert*

  string - The text that would usually populate the push notification preview.

*  *subject*

  object - The message object that needs to be deleted.

*  *received_at*

  number - the timestamp corresponding to when the notification was sent.

***

## `message.update`

A message was edited. This type is limited to group or direct message channels where the edit was observed, however it is always paired with a corresponding `line.create` message containing a `message.update` message event that can be caught from the main user channel.

```json linenums="1" title="Data Object Structure"
{
  "type": "message.update",
	"alert": "",
	"subject": {
		"attachments": [],
		"avatar_url": "https://i.groupme.com/860x860.jpeg.fcb7431eeb94483fa3356a6b835e653a",
		"created_at": 1751413087,
		"deleted_at": null,
		"deletion_actor": null,
		"group_id": "108466446",
		"id": "175141308755377678",
		"location": {
			"lat": "",
			"lng": "",
			"name": null
		},
		"name": "Sprocket",
		"parent_id": null,
		"picture_url": null,
		"pinned_at": null,
		"pinned_by": "",
		"sender_id": "131245991",
		"sender_type": "user",
		"source_guid": "F6F73443-78FC-4691-BE0C-B270A47C5B8D",
		"system": false,
		"text": "hola",
		"updated_at": 1751413700,
		"user_id": "131245991"
	},
	"received_at": 1751413700000
}
```

*  *type*

  string - Must be `message.update`.

*  *alert*

  string - The text that would usually populate the push notification preview.

*  *subject*

  object - The new message object that should replace the existing message.

*  *received_at*

  number - the timestamp corresponding to when the notification was sent.

***

## `typing`

Someone started typing. This type is limited to group or direct message channels where the typing indicator was observed. GroupMe will send these indicators every 5 seconds while typing. Clients assume typing has stopped if there is no new typing message after 5 seconds, or the user who is typing sends a message before the 5 seconds is up.

```json linenums="1" title="Data Object Structure"
{
  "type": "typing",
  "user_id": "93645911",
  "started": 1751404765673
}
```

*  *type*

  string - Must be `typing`.

*  *user_id*

  string - The ID of the user who is typing.

*  *started*

  number - A timestamp corresponding to when the typing started.

***

## Sending WebSocket Messages

After you've subscribed to channels, sending faye messages is relatively straightforward:

```js linenums="1"
const faye = require('faye');
const client = new faye.Client("https://push.groupme.com/faye");

// add your API credentials to outgoing WebSocket messages
client.addExtension({ 
  outgoing: (msg, callback) => {
    msg.ext = msg.ext || {};
    msg.ext.access_token = "<YOUR GROUPME API ACCESS TOKEN>";
    msg.ext.timestamp = Math.round(Date.now() / 1000);
    callback(msg);
 }
});

// subscribe to the '/user/:user_id' channel.
client.subscribe("/user/<YOUR GROUPME USER ID>", msg => { 
  /* Callback to run when a message is received */
});

client.publish("/user/<YOUR GROUPME USER ID>", data) // data should be the outgoing message data object you're trying to send
```

As far as we're aware, clients only send two types of message objects upstream besides subscriptions.

***

## `ping`

A keep-alive or presence message. Sending a `ping` type message causes the server to echo one back and then supresses the server from sending `ping` type messages for the next 30 seconds. By timing how long it takes to send this message and then receive an echoed ping from the server you can effectively calculate roundtrip ping latancy for the WebSocket gateway.

```json linenums="1" title="Data Object Structure"
{
	"type": "ping"
}
```

*  *type*
  
  string - Must be `ping`.

***

## `typing`

Used to initiate a typing indicator in a channel, these are good for 5 seconds and then must be resent to keep the indicator alive. Clients assume typing has stopped if there is no new typing message after 5 seconds, or the user who is typing sends a message before the 5 seconds is up.

```json linenums="1" title="Data Object Structure"
{
  "type": "typing",
  "user_id": "93645911",
  "started": 1751404765673
}
```

*  *type*

  string - Must be `typing`.

*  *user_id*

  string - your user ID

*  *started*

  number - A timestamp in millisconds since the Unix epoch. This value should virtually always be the current time.

***