---
title: "Direct Messages"
description: "Learn how to interact with GroupMe's direct message channels via the API."
---

# Direct Messages

Unless otherwise stated, endpoints are relative to https://api.groupme.com/v3/ and must include the token of the user making the call - so, for example, if an endpoint is `GET /groups`, the request you make should be using the URL `https://api.groupme.com/v3/groups?token=aSDFghJkl`, where `aSDFghJkl` is replaced with the user's token.

URLs which include a variable, such as `GET /groups/:id`, have their variables marked with a colon. So a request to that endpoint would look like `https://api.groupme.com/v3/groups/1234567?token=aSDFghJkl`, where `1234567` is replaced with the group's ID, and `aSDFghJkl` is replaced with the user's token.

Finally, all responses are wrapped in a response envelope of the following form:

```json linenums="1"
{
  "response": {
    "id": "12345",
    "name": "Family"
    ...
  },
  "meta": {
    "code": 200,
    "errors": []
  }
}
```

If the request succeeds, `meta.errors` will be null, and if the request fails, `response` will be null.

***

## List Existing DM Channels
Returns a paginated list of direct message chats, or conversations, sorted by updated_at descending.

```json linenums="1" title="HTTP Request"
GET /chats
```

**Parameters**

* *page*

	integer - Page number (Starts at 1, Defaults to 1)

* *per_page*

	integer — Number of chats per page (Defaults to 20)

```json linenums="1" title="HTTP Response"
Status: 200 OK
[
  {
    "created_at": 1352299338,
    "updated_at": 1352299338,
    "last_message": {
      "attachments": [
 
      ],
      "avatar_url": "https://i.groupme.com/200x200.jpeg.abcdef",
      "conversation_id": "12345+67890",
      "created_at": 1352299338,
      "favorited_by": [
 
      ],
      "id": "1234567890",
      "name": "John Doe",
      "recipient_id": "67890",
      "sender_id": "12345",
      "sender_type": "user",
      "source_guid": "GUID",
      "text": "Hello world",
      "user_id": "12345"
    },
    "messages_count": 10,
    "other_user": {
      "avatar_url": "https://i.groupme.com/200x200.jpeg.abcdef",
      "id": 12345,
      "name": "John Doe"
    }
  }
]
```

***

## Show Specific DM Channel

Directly fetch details about a specific DM channel using its compound `chat_id`. 

```json linenums="1" title="HTTP Request"
GET /chats/:chat_id
```

**Parameters**

* *chat_id*

    string - this is the compound ID of the chat, consisting of two seperate user IDs. It should look something like `93645911+118825642`.

```json linenums="1" title="HTTP Response"
Status: 200 OK
{
  "created_at": 1705616604,
  "last_message": {
    "attachments": [],
    "avatar_url": "https://i.groupme.com/1024x1024.jpeg.a13c40722d454d0e9c59d2cedb119056",
    "conversation_id": "56366372+93645911",
    "created_at": 1747778589,
    "favorited_by": [],
    "id": "174777858990222590",
    "name": "Bob",
    "recipient_id": "93645911",
    "sender_id": "56366372",
    "sender_type": "user",
    "source_guid": "FB9B32E6-45B8-4A63-8FAA-4A60005A0A60",
    "text": "I think it’s a good idea!",
    "user_id": "56366372",
    "pinned_at": null,
    "pinned_by": ""
  },
  "messages_count": 742,
  "other_user": {
    "avatar_url": "https://i.groupme.com/1024x1024.jpeg.a13c409e2d454320e9c59d2cedb119056",
    "id": "56366372",
    "name": "Bob"
  },
  "updated_at": 1747778589,
  "message_deletion_period": 2147483647,
  "message_deletion_mode": ["sender"],
  "requires_approval": false,
  "unread_count": null,
  "last_read_message_id": null,
  "last_read_at": null,
  "message_edit_period": 15
}
```

## Index Messages

Fetch direct messages between two users.

DMs are returned in groups of 20, ordered by created_at descending.

If no messages are found (e.g. when filtering with since_id) we return code 304.

Note that for historical reasons, likes are returned as an array of user ids in the favorited_by key.

```json linenums="1" title="HTTP Request"
GET /direct_messages
```

**Parameters**

* *other_user_id* (required)

	string — The other participant in the conversation.
	
* *before_id*

	string — Returns messages created before the given message ID
	
* *since_id*

	string — Returns messages created after the given message ID

* *after_id*

	string - Returns messages created immediately after the given message ID

* *limit*

	integer - Number of messages returned. Default is 20. Max is 100.
	
```json linenums="1" title="HTTP Response"
Status: 200 OK
{
  "count": 123,
  "direct_messages": [
    {
      "attachments": [],
      "avatar_url": "https://i.groupme.com/1024x1024.jpeg.a13c409e2d454d082c59d2cedb119056",
      "conversation_id": "56366372+93645911",
      "created_at": 1747778589,
      "favorited_by": [],
      "id": "174777858990222590",
      "name": "Bob",
      "recipient_id": "93645911",
      "sender_id": "56366372",
      "sender_type": "user",
      "source_guid": "FB9B32E6-45B8-4A63-8FAA-4A60005A0A60",
      "text": "I think it’s a good idea!",
      "user_id": "56366372",
      "pinned_at": null,
      "pinned_by": ""
    }
  ],
  "read_receipt": {
    "id": "",
    "chat_id": "56366372+93645911",
    "message_id": "174777858990222590",
    "user_id": "93645911",
    "read_at": 1747779017
  }
}
```

> [!note]
> If the server has no `read_receipt` parameter to share, it will be completely absent from the response.

***

## Send DM

Send a DM to another user

If you want to attach an image, you must first process it through the image service (More on that in the [attachments documentation](attachments.md)).

Attachments of type emoji rely on data from emoji PowerUps.

Clients use a placeholder character in the message text and specify a replacement charmap to substitute emoji characters

The character map is an array of arrays containing rune data ([[{pack_id,offset}],...]).

The placeholder should be a high-point/invisible UTF-8 character.

```json linenums="1" title="HTTP Request"
POST /direct_messages
{
  "direct_message": {
    "source_guid": "GUID",
    "recipient_id": "20",
    "text": "Hello world ",
    "attachments": [
      {
        "type": "image",
        "url": "https://i.groupme.com/123456789"
      },
      {
        "type": "image",
        "url": "https://i.groupme.com/123456789"
      },
      {
        "type": "location",
        "lat": "40.738206",
        "lng": "-73.993285",
        "name": "GroupMe HQ"
      },
      {
        "type": "emoji",
        "placeholder": "",
        "charmap": [
          [1, 42],
          [2, 34]
        ]
      }
    ]
  }
}
```
**Parameters**
* *source_guid* (required)

	string - Client-side IDs for messages. This can be used by clients to set their own identifiers on messages, but the server also scans these for de-duplication. That is, if two messages are sent with the same source_guid within one minute of each other, the second message will fail with a 409 Conflict response. So it's important to set this to a unique value for each message.
	
* *recipient_id* (required)

	string - the GroupMe user ID of the recipient of this message.
	
* *text* (required)

	string - This can be omitted if at least one attachment is present. The maximum length is 1,000 characters.
	
* *attachments*

	array - A polymorphic list of attachments (locations, images, etc). You may have more than one of any type of attachment, provided clients can display it.
	
	For more information on types of attachments and how to send them, check out the [attachments documentation](attachments.md)

```json linenums="1" title="HTTP Response"
Status: 201 Created
{
  "message": {
    "id": "1234567890",
    "source_guid": "GUID",
    "recipient_id": "20",
    "user_id": "1234567890",
    "created_at": 1302623328,
    "name": "John",
    "avatar_url": "https://i.groupme.com/123456789",
    "text": "Hello world ",
    "pinned_by": "",
    "pinned_at": null,
    "favorited_by": [
      "101"
    ],
    "attachments": [
      {
        "type": "image",
        "url": "https://i.groupme.com/123456789"
      },
      {
        "type": "location",
        "lat": "40.738206",
        "lng": "-73.993285",
        "name": "GroupMe HQ"
      },
      {
        "type": "emoji",
        "placeholder": "",
        "charmap": [
          [1, 42],
          [2, 34]
        ]
      }
    ]
  }
}
```
```json linenums="1" title="HTTP Response"
Status: 403 Forbidden
User has been auto-banned for sending too many messages.
```
```json linenums="1" title="HTTP Response"
Status: 400 Bad Request
There's a problem with the parameters. Check errors.
```

***

## Delete a message

```json linenums="1" title="HTTP Request"
DELETE /conversations/:group_id/messages/:message_id
```

```json linenums="1" title="HTTP Response"
Status: 204 Deleted
```

***

## Send a Read Receipt

You can only mark new messages as read, attempting to read a message sent before one you have already read will update the timestamp on the latest read message.

> [!important]
> This request is relative to `https://v2.groupme.com/`, not `https://api.groupme.com/v3/`.

```json linenums="1" title="HTTP Request"
POST https://v2.groupme.com/read_receipts
{
  "read_receipt": {
    "message_id": "174769395496126372",
    "chat_id": "74938777+93645911"
  },
}
```

**Parameters**

* *message_id*

    String - The ID of the message  you'd like to mark read.

* *chat_id*

    String - The ID of the direct message channel the message can be found in.

```json linenums="1" title="HTTP Response"
Status: 200 OK
{
  "read_receipt": {
    "id": "174769438312353599",
    "chat_id": "74938777+93645911",
    "message_id": "174769438312353599",
    "user_id": "93645911",
    "read_at": 1747694449
  }
}
```
