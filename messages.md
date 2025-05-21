# Group Messages

Unless otherwise stated, endpoints are relative to https://api.groupme.com/v3/ and must include the token of the user making the call - so, for example, if an endpoint is `GET /groups`, the request you make should be using the URL `https://api.groupme.com/v3/groups?token=aSDFghJkl`, where `aSDFghJkl` is replaced with the user's token.

URLs which include a variable, such as `GET /groups/:id`, have their variables marked with a colon. So a request to that endpoint would look like `https://api.groupme.com/v3/groups/1234567?token=aSDFghJkl`, where `1234567` is replaced with the group's ID, and `aSDFghJkl` is replaced with the user's token.

Finally, all responses are wrapped in a response envelope of the following form:

```
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

## Index
Retrieve messages for a group.

By default, messages are returned in groups of 20, ordered by created_at descending. This can be raised or lowered by passing a limit parameter, up to a maximum of 100 messages.

Messages can be scanned by providing a message ID as either the before_id, since_id, or after_id parameter. If before_id is provided, then messages immediately preceding the given message will be returned, in descending order. This can be used to continually page back through a group's messages.

The after_id parameter will return messages that immediately follow a given message, this time in ascending order (which makes it easy to pick off the last result for continued pagination).

Finally, the since_id parameter also returns messages created after the given message, but it retrieves the most recent messages. For example, if more than twenty messages are created after the since_id message, using this parameter will omit the messages that immediately follow the given message. This is a bit counterintuitive, so take care.

If no messages are found (e.g. when filtering with before_id) we return code 304.

Note that for historical reasons, likes are returned as an array of user ids in the favorited_by key.

**Request**

`GET /groups/:group_id/messages`

**Parameters**

* *before_id*

	string - Returns messages created before the given message ID
	
* *since_id*

	string - Returns most recent messages created after the given message ID
	
* *after_id*

	string - Returns messages created immediately after the given message ID
	
* *limit*

	integer - Number of messages returned. Default is 20. Max is 100.

* *acceptFiles*

  	boolean - A flag to tell the image service your client is capable of receiving non-image files. Setting this value to `0` or omitting it entirely will NOT omit messages with file attachments in the response; these messages will still be included, but the text property will be overwritten with `Please upgrade to download this file.` The file attachment will still be fully intact, however. In practice this means that if you care about the text in the message with an attachment, you should set `acceptFiles=1`.
	
	
**Responses**

```
Status: 200 OK
{
  "count": 123,
  "messages": [
    {
      "id": "1234567890",
      "source_guid": "GUID",
      "created_at": 1302623328,
      "user_id": "1234567890",
      "group_id": "1234567890",
      "name": "John",
      "avatar_url": "https://i.groupme.com/123456789",
      "text": "Hello world ",
      "system": true,
      "pinned_by": "",
      "pinned_at": null,
      "favorited_by": [
        "101",
        "66",
        "1234567890"
      ],
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
            [
              1,
              42
            ],
            [
              2,
              34
            ]
          ]
        }
      ]
    }
  ]
}
```

***

## Show a Specific Message

Fetches an individual message object by its ID

> [!important]
> This request is relative to `https://api.groupme.com/v4/`, not `https://api.groupme.com/v3/`.

**Request**
```
GET https://api.groupme.com/v4/groups/:group_id/messages/:message_id
```

**Parameters**

* *message_id*

    string - The ID of the message you'd like to fetch

**Response**
```
Status: 200 OK
{
  "message": {
    "attachments": [],
    "avatar_url": "https://i.groupme.com/572x525.png.e40a56a9f4c141868c56c2fc52bb8b4a",
    "created_at": 1743898778,
    "favorited_by": [],
    "group_id": "28330125",
    "id": "1743898778900707",
    "name": "Bob",
    "sender_id": "3274635",
    "sender_type": "user",
    "source_guid": "android-cbe3d2b5-d245-4b89-8555-838852949490",
    "system": false,
    "text": "hi there!",
    "user_id": "3274635",
    "platform": "gm",
    "pinned_at": null,
    "pinned_by": ""
  }
}
```

## Send Message

Send a message to a group

If you want to attach an image, you must first process it through GroupMe's image service (More on that in the [attachments documentation](attachments.md))

Attachments of type emoji rely on data from [GroupMe Emoji powerups](emoji.md).

Clients use a placeholder character in the message text and specify a replacement charmap to substitute emoji characters

The character map is an array of arrays containing rune data ([[{pack_id,offset}],...]).

The placeholder should be a high-point/invisible UTF-8 character.

**Request**
```
POST /groups/:group_id/messages
{
  "message": {
    "source_guid": "GUID",
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
          [
            1,
            42
          ],
          [
            2,
            34
          ]
        ]
      }
    ]
  }
}
```

**Parameters**
* *source_guid* (required)

	string - Client-side IDs for messages. This can be used by clients to set their own identifiers on messages, but the server also scans these for de-duplication. That is, if two messages are sent with the same source_guid within one minute of each other, the second message will fail with a 409 Conflict response. So it's important to set this to a unique value for each message.
	
* *text* (required)

	string - This can be omitted if at least one attachment is present. The maximum length is 1,000 characters.
	
* *attachments*

	array - A polymorphic list of attachments (locations, images, replies, etc). You may have more than one of any type of attachment, provided clients can display it.
	
	For more information on types of attachments and how to send them, check out the [attachments documentation](attachments.md)

**Responses**

```
Status: 201 Created
{
  "message": {
    "id": "1234567890",
    "source_guid": "GUID",
    "created_at": 1302623328,
    "user_id": "1234567890",
    "group_id": "1234567890",
    "name": "John",
    "avatar_url": "https://i.groupme.com/123456789",
    "text": "Hello world ",
    "system": false,
    "pinned_by": "",
    "pinned_at": null,
    "favorited_by": [
      "101",
      "66",
      "1234567890"
    ],
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
          [
            1,
            42
          ],
          [
            2,
            34
          ]
        ]
      }
    ]
  }
}
```

***

## Edit Message

Edit a message you've already sent

If you want to attach an image, you must first process it through GroupMe's image service (More on that in the [attachments documentation](attachments.md))

Attachments of type emoji rely on data from [GroupMe Emoji powerups](emoji.md).

> [!important]
> This request is relative to `https://api.groupme.com/v4/`, not `https://api.groupme.com/v3/`.

**Request**
```
PUT https://api.groupme.com/v4/groups/:group_id/messages/:message_id
{
  "text": "Hello World!",
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
  ]
}
```

**Parameters**
* *text* (required)

	string - This can be omitted if at least one attachment is present. The maximum length is 1,000 characters.
	
* *attachments*

	array - A polymorphic list of attachments (locations, images, replies, etc). You may have more than one of any type of attachment, provided clients can display it.
	
	For more information on types of attachments and how to send them, check out the [attachments documentation](attachments.md)

**Responses**

```
Status: 200 OK
{
  "message": {
    "id": "1234567890",
    "source_guid": "GUID",
    "created_at": 1302623328,
    "updated_at": 1747065854,
    "user_id": "1234567890",
    "group_id": "1234567890",
    "name": "John",
    "avatar_url": "https://i.groupme.com/123456789",
    "text": "Hello World!",
    "system": false,
    "pinned_by": "",
    "pinned_at": null,
    "favorited_by": [
      "101",
      "66",
      "1234567890"
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
    ]
  }
}
```

***


## Delete a message

**Request**

`DELETE /conversations/:group_id/messages/:message_id`

**Responses**

```
Status: 204 Deleted
```
