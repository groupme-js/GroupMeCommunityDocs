---
title: "GroupMe Polls"
description: "Learn how to interact with GroupMe's polling system via the API."
---

# Polls

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

## Create a poll

Creates a poll, which is immediately sent to the group.

**Request**
```json
POST /poll/:group_id
{
	"subject": "Is Dasani the objective best brand of bottled water?",
	"options": [
		{"title": "Yes"},
		{"title": "Absolutely"}
	],
	"expiration": 1614042900,
	"type": "multi",
	"visibility": "public"
}
```

**Parameters**

* *subject* (required)

	string - the title of the poll

* *options* (required)

	array - contains objects of the form `{"title": option}`, where `option` is the title of that choice

* *expiration* (required)

	integer - Time at which the poll expires, in SECONDS (not milliseconds) since January 1, 1970.

* *type* (required)

	string - can either be "single" or "multi". Determines if users can respond with more than one choice or only one.

* *visibility* (required)

	string - can either be "anonymous" or "public". If "public", others will be able to see who voted for which options.

	

**Responses**

```json
Status: 201 Created
{
  "poll": {
    "data": {
      "id": "1234567890",
      "subject": "Is Dasani the objective best brand of bottled water?",
      "owner_id": "123456789",
      "conversation_id": "14538582",
      "created_at": 1613956027,
      "expiration": 1614042900,
      "status": "active",
      "options": [
        {
          "id": "1",
          "title": "Yes"
        },
        {
          "id": "2",
          "title": "Absolutely"
        }
      ],
      "last_modified": 1613956027,
      "type": "multi",
      "visibility": "public"
    }
  },
  "message": {
    "attachments": [
      {
        "poll_id": "1613956027340750",
        "type": "poll"
      }
    ],
    "avatar_url": "https://i.groupme.com/1100x1148.jpeg.705e8e84384c4249bb956f230e43d67d",
    "created_at": 1613956027,
    "event": {
      "data": {
        "conversation": {
          "id": "123456789"
        },
        "poll": {
          "id": "123456789",
          "subject": "Is this a test?"
        },
        "user": {
          "id": "123456789",
          "nickname": "Dasani Lover"
        }
      },
      "type": "poll.created"
    },
    "favorited_by": [],
    "group_id": "123456789",
    "id": "1234567890",
    "name": "Daniel Royer",
    "sender_id": "123456789",
    "sender_type": "user",
    "source_guid": "77a6d4981c554c71ac40ae30ba15e8a6",
    "system": false,
    "text": "Created new poll 'Is Dasani the objective best brand of bottled water?': https://s.groupme.com/1shwZm",
    "user_id": "123456789"
  }
}
```

***

## Viewing Results

Shows the responses to a poll

**Request**
```json
GET /poll/:group_id/:poll_id
```

**Responses**

```json
Status: 201 Created
{
  "poll": {
    "data": {
      "id": "123456789",
      "subject": "Is Dasani the objective best brand of bottled water?",
      "owner_id": "123456789",
      "conversation_id": "123456789",
      "created_at": 1613956027,
      "expiration": 1614042900,
      "status": "active",
      "options": [
        {
          "id": "1",
          "title": "Yes",
          "votes": 1,
          "voter_ids": [
            "123456789"
          ]
        },
        {
          "id": "2",
          "title": "Absolutely",
          "votes": 2,
          "voter_ids": [
            "123456789",
            "1234567890"
          ]
        }
      ],
      "last_modified": 1613957145,
      "type": "multi",
      "visibility": "public"
    },
    "user_votes": [
      "2",
      "1"
    ]
  }
}
```

In an anonymous poll, the "voter_ids" field does not exist.

***

## Voting in a poll

Vote in a poll, or change your vote if you already voted.

**Request**

For single-response polls:
```json
POST /poll/:group_id/:poll_id/:option_id
```

For multi-response polls:
```json
POST /poll/:group_id/:poll_id/
{
	"votes": ["1", "2"]
}
```

**Parameters**

* *votes*
	array - an array of the IDs of the options you want to vote for

**Responses**
```json
Status: 200 OK
{
  "poll": {
    "data": {
      "id": "123456789",
      "subject": "Is Dasani the objective best brand of bottled water?",
      "owner_id": "123456789",
      "conversation_id": "123456789",
      "created_at": 1613956027,
      "expiration": 1614042900,
      "status": "active",
      "options": [
        {
          "id": "1",
          "title": "Yes",
          "votes": 1,
          "voter_ids": [
            "123456789"
          ]
        },
        {
          "id": "2",
          "title": "Absolutely",
          "votes": 2,
          "voter_ids": [
            "123456789",
            "1234567890"
          ]
        }
      ],
      "last_modified": 1613957145,
      "type": "multi",
      "visibility": "public"
    },
    "user_votes": [
      "2",
      "1"
    ]
  }
}
```

In an anonymous poll, the "voter_ids" field does not exist.

If the user has not voted, the "user_votes" field will not exist.

***

## End poll

End a poll right now

**Request**
```json
POST /poll/:group_id/:poll_id/end
```

**Responses**
```json
Status: 200 OK
{
  "poll": {
    "data": {
      "id": "123456789",
      "subject": "Is Dasani the objective best brand of bottled water?",
      "owner_id": "123456789",
      "conversation_id": "123456789",
      "created_at": 1613956027,
      "expiration": 1614042900,
      "status": "active",
      "options": [
        {
          "id": "1",
          "title": "Yes",
          "votes": 1,
          "voter_ids": [
            "123456789"
          ]
        },
        {
          "id": "2",
          "title": "Absolutely",
          "votes": 2,
          "voter_ids": [
            "123456789",
            "1234567890"
          ]
        }
      ],
      "last_modified": 1613957145,
      "type": "multi",
      "visibility": "public"
    },
    "user_votes": [
      "2",
      "1"
    ]
  }
}
```

***

## List polls

List all the polls in this chat

**Request**
```json
GET /poll/:group_id
```

**Responses**
```json
Status: 200 OK
{
  "polls": [
    {
      "data": {
        "id": "123456789",
        "subject": "Is this also a test?",
        "owner_id": "123456789",
        "conversation_id": "123456789",
        "created_at": 1613957003,
        "expiration": 1614043800,
        "status": "active",
        "options": [
          {
            "id": "1",
            "title": "Sure",
            "votes": 2
          },
          {
            "id": "2",
            "title": "I guess"
          }
        ],
        "last_modified": 1613958713,
        "type": "single",
        "visibility": "anonymous"
      },
      "user_vote": "1",
      "user_votes": [
        "1"
      ]
    },
    {
      "data": {
        "id": "123456789",
        "subject": "Is this a test?",
        "owner_id": "123456789",
        "conversation_id": "123456789",
        "created_at": 1613956027,
        "expiration": 1613958805,
        "status": "past",
        "options": [
          {
            "id": "1",
            "title": "Yes",
            "votes": 1,
            "voter_ids": [
              "123456789"
            ]
          },
          {
            "id": "2",
            "title": "Yes but the second option",
            "votes": 1,
            "voter_ids": [
              "1234567890"
            ]
          }
        ],
        "last_modified": 1613958805,
        "type": "multi",
        "visibility": "public"
      },
      "user_votes": [
        "1"
      ]
    }
  ],
  "continuation_token": null
}
```
