# Likes

All endpoints are relative to https://api.groupme.com/v3/ and must include the token of the user making the call - so, for example, if an endpoint is `GET /groups`, the request you make should be using the URL `https://api.groupme.com/v3/groups?token=aSDFghJkl`, where `aSDFghJkl` is replaced with the user's token.

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

## Like

Like a message.

**Request**

`POST /messages/:conversation_id/:message_id/like`

**Responses**

```
Status: 200 OK
```

***

## Unlike
Unlike a message.

**Request**

`POST /messages/:conversation_id/:message_id/unlike`

**Responses**
```
Status: 200 OK
```

***

## Index

A list of the liked messages in the group for a given period of time. Messages are ranked in order of number of likes.

**Request**

`GET /groups/:group_id/likes?period=<day|week|month>`

**Parameters**

* *period* (required)
	string — one of: 'day', 'week', or 'month'

**Responses**
```
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
          "type": "split",
          "token": "SPLIT_TOKEN"
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
          "type": "split",
          "token": "SPLIT_TOKEN"
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

## My Likes

A list of messages you have liked. Messages are returned in reverse chrono-order. Note that the payload includes a liked_at timestamp in ISO-8601 format.

**Request**

`GET /groups/:group_id/likes/mine`

**Responses**
```
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
          "type": "split",
          "token": "SPLIT_TOKEN"
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

`GET /groups/:group_id/likes/for_me`

**Responses**
```
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
          "type": "split",
          "token": "SPLIT_TOKEN"
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