---
title: "WebSocket Message Types"
description: "Learn how to interact with GroupMe's WebSocket messages via the API."
---

# WebSocket Message Types

When your client is connected to the GroupMe WebSocket server and subscribed to channels, you will receive messages. These messages follow the Bayeux protocol, and the core information is typically found within the `data` object of the incoming Faye message.

The most important field within the message object is `data.type`, which indicates the kind of event that has occurred.

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

The following sections describe the different message types you may receive, along with their data structure and properties.

***

## `ping`
  
A keep-alive heartbeat message. This message is sent down every 30 seconds in order to ensure your client is still listening. You can generally ignore these messages if you dont plan on sending them, as the server will keep the connection alive on its own. Sending a `ping` type message causes the server to echo one back and then suppresses the server from sending pings for the next 30 seconds. By timing how long it takes to send this message and then receive an echoed ping from the server you can effectively calculate roundtrip ping latancy for the WebSocket gateway.

This and [`typing`](#typing) are the only two message types clients are permitted by the API to send.

```json linenums="1" title="Data Object Structure"
{
    "type": "ping"
}
```

*  *type*
  
  string - Must be `ping`.

***

## `line.create`

A message was sent in a channel you participate in. This is the most common type of message, and includes many events that normally send system messages (like member join/leave events). More on events can be found [here](../common/events.md).

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

  object - The message object this push is referring to.

*  *received_at*

  number - the timestamp corresponding to when the notification was sent.

However, in some cases you may observe a system message with an attached `subject.event` property. These events are documented [here](../common/events.md).

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

  object - The message object this push is referring to.

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

  object - The message object this push is referring to.

*  *received_at*

  number - the timestamp corresponding to when the notification was sent.

However, in some cases you may observe a system message with an attached `subject.event` property. These are documented [here](../common/events.md).

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

  object - The message object this push is referring to.

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

This and [`ping`](#ping) are the only two messages clients are allowed to send.

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
