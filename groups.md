# Groups

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

## Index
List the authenticated user's active groups.

The response is paginated, with a default of 10 groups per page.

Please consider using of omit=memberships parameter. Not including member lists might significantly improve user experience of your app for users who are participating in huge groups.

**Request**

`GET /groups`

**Parameters**

* *page*

	integer — Fetch a particular page of results. Defaults to 1.
	
* *per_page*

	integer — Define page size. Defaults to 10.
	
* *omit*

	string — Comma separated list of data to omit from output. Currently supported value is only "memberships". If used then response will contain empty (null) members field.
	
**Responses**
```Status: 200 OK
[
  {
    "id": "1234567890",
    "name": "Family",
    "type": "private",
    "description": "Coolest Family Ever",
    "image_url": "https://i.groupme.com/123456789",
    "creator_user_id": "1234567890",
    "created_at": 1302623328,
    "updated_at": 1302623328,
    "members": [
      {
        "user_id": "1234567890",
        "nickname": "Jane",
        "muted": false,
        "image_url": "https://i.groupme.com/123456789"
      }
    ],
    "share_url": "https://groupme.com/join_group/1234567890/SHARE_TOKEN",
    "messages": {
      "count": 100,
      "last_message_id": "1234567890",
      "last_message_created_at": 1302623328,
      "preview": {
        "nickname": "Jane",
        "text": "Hello world",
        "image_url": "https://i.groupme.com/123456789",
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
    }
  }
]```

***

## Former

List the groups you have left but can rejoin.

**Request**

`GET /groups/former`

**Responses**

```Status: 200 OK
[
  {
    "id": "1234567890",
    "name": "Family",
    "type": "private",
    "description": "Coolest Family Ever",
    "image_url": "https://i.groupme.com/123456789",
    "creator_user_id": "1234567890",
    "created_at": 1302623328,
    "updated_at": 1302623328,
    "members": [
      {
        "user_id": "1234567890",
        "nickname": "Jane",
        "muted": false,
        "image_url": "https://i.groupme.com/123456789"
      }
    ],
    "share_url": "https://groupme.com/join_group/1234567890/SHARE_TOKEN",
    "messages": {
      "count": 100,
      "last_message_id": "1234567890",
      "last_message_created_at": 1302623328,
      "preview": {
        "nickname": "Jane",
        "text": "Hello world",
        "image_url": "https://i.groupme.com/123456789",
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
    }
  }
]```

***

## Show

Load a specific group.

**Request**

`GET /groups/:id`

**Parameters**

*id* (required)

	string - the ID of the group to show details of

**Responses**
```Status: 200 OK
{
  "id": "1234567890",
  "name": "Family",
  "type": "private",
  "description": "Coolest Family Ever",
  "image_url": "https://i.groupme.com/123456789",
  "creator_user_id": "1234567890",
  "created_at": 1302623328,
  "updated_at": 1302623328,
  "members": [
    {
      "user_id": "1234567890",
      "nickname": "Jane",
      "muted": false,
      "image_url": "https://i.groupme.com/123456789"
    }
  ],
  "share_url": "https://groupme.com/join_group/1234567890/SHARE_TOKEN",
  "messages": {
    "count": 100,
    "last_message_id": "1234567890",
    "last_message_created_at": 1302623328,
    "preview": {
      "nickname": "Jane",
      "text": "Hello world",
      "image_url": "https://i.groupme.com/123456789",
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
  }
}```

***

## Create

Create a new group

**Request**
```POST /groups
{
  "name": "Family",
  "share": true,
  "image_url": "https://i.groupme.com/123456789"
}```

**Parameters**
*name* (required)
	string — Primary name of the group. Maximum 140 characters
	
*description*
	string — A subheading for the group. Maximum 255 characters
	
*image_url*
	string — GroupMe Image Service URL
	
*share*
	boolean — If you pass a true value for share, we'll generate a share URL. Anybody with this URL can join the group.

Responses
```Status: 201 Created
{
  "id": "1234567890",
  "name": "Family",
  "type": "private",
  "description": "Coolest Family Ever",
  "image_url": "https://i.groupme.com/123456789",
  "creator_user_id": "1234567890",
  "created_at": 1302623328,
  "updated_at": 1302623328,
  "members": [
    {
      "user_id": "1234567890",
      "nickname": "Jane",
      "muted": false,
      "image_url": "https://i.groupme.com/123456789"
    }
  ],
  "share_url": "https://groupme.com/join_group/1234567890/SHARE_TOKEN",
  "messages": {
    "count": 100,
    "last_message_id": "1234567890",
    "last_message_created_at": 1302623328,
    "preview": {
      "nickname": "Jane",
      "text": "Hello world",
      "image_url": "https://i.groupme.com/123456789",
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
  }
}```

***

## Update

Update a group after creation

**Request**
```POST /groups/:id/update
{
  "name": "Family",
  "share": true,
  "image_url": "https://i.groupme.com/123456789",
  "office_mode": true
}```

**Parameters**
*name*
	string - The name of the group
*description*
	string - A description of the group
*image_url*
	string - A URL to use as the avatar for the group
*office_mode*
	boolean - If Office Mode is enabled, notifications won't buzz your phone.
*share*
	boolean — If you pass a true value for share, we'll generate a share URL. Anybody with this URL can join the group.
**Responses**
```Status: 200 OK
{
  "id": "1234567890",
  "name": "Family",
  "type": "private",
  "description": "Coolest Family Ever",
  "image_url": "https://i.groupme.com/123456789",
  "creator_user_id": "1234567890",
  "created_at": 1302623328,
  "updated_at": 1302623328,
  "members": [
    {
      "user_id": "1234567890",
      "nickname": "Jane",
      "muted": false,
      "image_url": "https://i.groupme.com/123456789"
    }
  ],
  "share_url": "https://groupme.com/join_group/1234567890/SHARE_TOKEN",
  "messages": {
    "count": 100,
    "last_message_id": "1234567890",
    "last_message_created_at": 1302623328,
    "preview": {
      "nickname": "Jane",
      "text": "Hello world",
      "image_url": "https://i.groupme.com/123456789",
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
  }
}```

***

## Destroy
Disband a group

This action is only available to the group creator

**Request**
`POST /groups/:id/destroy`

**Responses**
```Status: 200 OK```

## Join
Join a shared group

**Request**
`POST /groups/:id/join/:share_token`

**Responses**
```Status: 200 OK
{
  "group": {
    "id": "1234567890",
    "name": "Family",
    "type": "private",
    "description": "Coolest Family Ever",
    "image_url": "https://i.groupme.com/123456789",
    "creator_user_id": "1234567890",
    "created_at": 1302623328,
    "updated_at": 1302623328,
    "members": [
      {
        "user_id": "1234567890",
        "nickname": "Jane",
        "muted": false,
        "image_url": "https://i.groupme.com/123456789"
      }
    ],
    "share_url": "https://groupme.com/join_group/1234567890/SHARE_TOKEN",
    "messages": {
      "count": 100,
      "last_message_id": "1234567890",
      "last_message_created_at": 1302623328,
      "preview": {
        "nickname": "Jane",
        "text": "Hello world",
        "image_url": "https://i.groupme.com/123456789",
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
    }
  }
}```

***

## Rejoin
Rejoin a group. Only works if you previously removed yourself.

**Request**

POST /groups/join

**Parameters**
*group_id* (required)
	string - the ID of the group to join

**Responses**
```Status: 200 OK
{
  "id": "1234567890",
  "name": "Family",
  "type": "private",
  "description": "Coolest Family Ever",
  "image_url": "https://i.groupme.com/123456789",
  "creator_user_id": "1234567890",
  "created_at": 1302623328,
  "updated_at": 1302623328,
  "members": [
    {
      "user_id": "1234567890",
      "nickname": "Jane",
      "muted": false,
      "image_url": "https://i.groupme.com/123456789"
    }
  ],
  "share_url": "https://groupme.com/join_group/1234567890/SHARE_TOKEN",
  "messages": {
    "count": 100,
    "last_message_id": "1234567890",
    "last_message_created_at": 1302623328,
    "preview": {
      "nickname": "Jane",
      "text": "Hello world",
      "image_url": "https://i.groupme.com/123456789",
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
  }
}```

***

## Change owner(s)
Change owner of requested groups.

This action is only available to the group creator.

Response is array of result objects which contain status field - the result of change owner action for every request:

* **'200'** - OK
* **'400'** - when requestor is also a new owner
* **'403'** - requestor is not owner of the group
* **'404'** - group or new owner not found or new owner is not member of the group
* **'405'** - request object is missing required field or any of the required fields is not an ID

**Request**
`POST /groups/change_owners`

**Parameters**
*requests* (required)
	array — One request is object where user_id is the new owner who must be active member of a group specified by group_id.
*object*
	*group_id* (required)
		string - The ID of the affected group
	*owner_id* (required)
		string - The ID of the person to be made owner
		
**Responses**
```Status: 200 OK
{
  "results": [
    {
      "group_id": "1234567890",
      "owner_id": "1234567890",
      "status": "200"
    },
    {
      "group_id": "1234567890",
      "owner_id": "1234567890",
      "status": "400"
    }
  ]
}```
```Status: 400 Bad Request
'requests' field missing in request body```