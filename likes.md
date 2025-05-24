---
title: "GroupMe Reactions"
description: "Learn how to interact with GroupMe's reaction system via the API."
---

# Reactions

Unless otherwise stated, endpoints are relative to https://api.groupme.com/v3/ and must include the token of the user making the call - so, for example, if an endpoint is `GET /groups`, the request you make should be using the URL `https://api.groupme.com/v3/groups?token=aSDFghJkl`, where `aSDFghJkl` is replaced with the user's token.

URLs which include a variable, such as `GET /groups/:id`, have their variables marked with a colon. So a request to that endpoint would look like `https://api.groupme.com/v3/groups/1234567?token=aSDFghJkl`, where `1234567` is replaced with the group's ID, and `aSDFghJkl` is replaced with the user's token.

Finally, all responses are wrapped in a response envelope of the following form:

```json
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

## Like

Like a message. 

**Request**

```json
POST /messages/:conversation_id/:message_id/like
```

**Responses**

```json
Status: 200 OK
```

***

## Reactions (Replacing likes in the new v7 update)

React to a message with either a unicode or GroupMe emoji.

GroupMe restricts reactions to [GroupMe powerups](emoji.md) and the 15 unicode options displayed in the client (❤️ 👍 🤣 🎉 🔥 😮 👀 😭 🥺 🙏 💀 🫶 🤬 💅 🫠). Any other unicode emojis will be rejected by the server.

There is no way to apply more than one reaction at a time to any given message, attempting to do so will overwrite the original reaction with the new one.

**Request**

```json
POST /messages/:conversation_id/:message_id/like
{
  "like_icon": {
    "type": "unicode",
    "code": "❤️"
  }
}
```

or

```json
POST /messages/:conversation_id/:message_id/like
{
  "like_icon": {
    "type": "emoji",
    "pack_id": 1,
    "pack_index": 12
  }
}
```

**Parameters**

* *like_icon* (optional)
	object — can contain reaction objects of type `unicode` (for standard unicode characters/emojis) or `emoji` for GroupMe emoji/powerups. `unicode` type reacions have a `code` parameter that specifies what text should be displayed. `emoji` type reactions have parameters `pack_id` and `pack_index`. See the [emoji documentation](emoji.md) for more information on what these values mean.

**Responses**

```json
Status: 200 OK
{
  "reactions": [
    {
      "type": "unicode",
      "pack_id": 0,
      "pack_index": 0,
      "code": "❤️"
    }
  ]
}
```

***

## Unlike
Unlike / remove your reactions from a message.

**Request**
```json
POST /messages/:conversation_id/:message_id/unlike
```

**Responses**
```json
Status: 200 OK
```

***

## Leaderboard

A list of the liked messages in the group for a given period of time. Messages are ranked in order of number of likes.

**Request**
```json
GET /groups/:group_id/likes?period=<day|week|month>
```
**Parameters**

* *period* (required)
	string — one of: 'day', 'week', or 'month'

**Responses**
```json
Status: 200 OK
{
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
        {
          "type": "emoji",
          "placeholder": "",
          "charmap": [
            [1, 42],
            [2, 34]
          ]
        }
      ]
    },
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
      "favorited_by": [
        "1",
        "2"
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
  ]
}
```

***

## My Likes

A list of messages you have liked. Messages are returned in reverse chrono-order. Note that the payload includes a liked_at timestamp in ISO-8601 format.

**Request**
```json
GET /groups/:group_id/likes/mine
```

**Responses**
```json
Status: 200 OK
{
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
        {
          "type": "emoji",
          "placeholder": "",
          "charmap": [
            [1, 42],
            [2, 34]
          ]
        }
      ],
      "liked_at": "2014-05-08T18:30:31.6617Z"
    }
  ]
}
```

***

## My Hits
A list of messages others have liked.

**Request**
```json
GET /groups/:group_id/likes/for_me
```

**Responses**
```json
Status: 200 OK
{
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
  ]
}
```
