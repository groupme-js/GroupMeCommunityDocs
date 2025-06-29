---
title: "Groups"
description: "Learn how to interact with GroupMe group channels via the API."
---

# Groups

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

## Index

List the authenticated user's active groups.

The response is paginated, with a default of 10 groups per page.

Please consider using of omit=memberships parameter. Not including member lists might significantly improve user experience of your app for users who are participating in huge groups.

```json linenums="1" title="HTTP Request"
GET /groups
```
**Parameters**

* *page*

	integer - Fetch a particular page of results. Defaults to 1.
	
* *per_page*

	integer - Define page size. Defaults to 10.
	
* *omit*

	string - Comma separated list of data to omit from output. Currently supported value is only "memberships". If used then response will contain empty (null) members field.
	
```json linenums="1" title="HTTP Response"
Status: 200 OK
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
  }
]
```

***

## Former

List the groups you have left but can rejoin.

```json linenums="1" title="HTTP Request"
GET /groups/former
```

```json linenums="1" title="HTTP Response"
Status: 200 OK
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
          },,
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
  }
]
```

***

## Summarize Group Memberships

Returns an *unpaginated* succinct list of all group IDs your account has ever been in, and your membership status within them. Useful for quickly fetching all of your group IDs without extra garbage attached.

Possible States:

- `"active"`: you're currently a member of the group
- `"exited"`: you've left the group
- `"removed"`: you've been kicked from the group
- `"exited_removed"`: you've left the group on your own, and have been barred from re-entering

```json linenums="1" title="HTTP Request"
GET /memberships/states
```

```json linenums="1" title="HTTP Response"
Status: 200 OK
[
  {
    "group_id": "107702077",
    "state": "active"
  },
  {
    "group_id": "106666358",
    "state": "exited"
  },
  {
    "group_id": "102270238",
    "state": "removed"
  },
  {
    "group_id": "91620876",
    "state": "exited_removed"
  }
]
```

***

## Show

Load a specific group.


```json linenums="1" title="HTTP Request"
GET /groups/:group_id
```

**Parameters**

* *group_id* (required)

	string - the ID of the group to show details of

```json linenums="1" title="HTTP Response"
Status: 200 OK
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
}
```

***

## Create

> [!WARNING]
> **Breaking Change: Device Verification**
> This endpoint now requires platform-level device verification (e.g., Apple App Attest or Google Play Integrity). Requests must include valid attestation headers (`X-verify-token`), or they will be rejected.
> This change was introduced by GroupMe to mitigate automated abuse. Unfortunately, it also blocks all third-party clients, including many valuable community projects. As such, this endpoint is no longer accessible to third-party applications and is retained here for historical reference only.

Create a new group

```json linenums="1" title="HTTP Request"
POST /groups
{
  "name": "Family",
  "share": true,
  "image_url": "https://i.groupme.com/123456789"
}
```

**Parameters**

* *name* (required)

	string - Primary name of the group. Maximum 140 characters
	
* *description*

	string - A subheading for the group. Maximum 255 characters
	
* *image_url*

	string - GroupMe [Image Service](images.md) URL
	
* *share*

	boolean - If you pass a true value for share, we'll generate a share URL. Anybody with this URL can join the group.

```json linenums="1" title="HTTP Response"
Status: 201 Created
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
}
```

***

## Update

Update a group after creation

```json linenums="1" title="HTTP Request"
POST /groups/:id/update
{
  "name": "Family",
  "share": true,
  "image_url": "https://i.groupme.com/123456789",
  "office_mode": true
  "theme_name": "cogs"
  "requires_approval": true,
  "show_join_question": true,
  "join_question": {
    "text": "You're not a bot, are you?"
    "type": "join_reason/questions/text"
  },
  "like_icon": {
    "pack_id": 1,
    "pack_index": 65,
    "type": "emoji"
  },
  "visibility": "searchable",
  "group_type": "closed",
  "message_deletion_mode": [
    "admin",
    "sender"
  ]
}
```

**Parameters**

* *name*

	string - The name of the group
	
* *description*

	string - A description of the group
	
* *image_url*

	string - A URL to use as the avatar for the group. in order to be used, the Image must first be uploaded to GroupMe's [Image Service](images.md).
	
* *office_mode*

	boolean - If Office Mode is enabled, notifications won't buzz your phone.

* *theme_name*

  	string - The name of a theme to apply to the group, set to null to return to the default theme.

* *share*

	boolean - If you pass a true value for share, we'll generate a share URL. Anybody with this URL can join the group.

* *requires_approval*

	boolean - If true, members must request to join the group before they can be admitted.

* *show_join_question*

	boolean - If true, members must answer a question prompt in oder to request to join a group. The question defaults to "Why do you want to join this group".
                  `"requires_approval"` must be true for this value to take effect.
* *join_question*

  	object - Has two properties, `"type"` must always be set to `"join_reason/questions/text"` , and `"text"` is the custom join question. 
                 Both `"requires_approval"` and `"show_join_question"` must be true for this value to take effect.

* *like_icon*

  	object - The GroupMe powerup emoji to set as the group's like icon.
                 See the [emoji documentation](emoji.md) for more information on what these values mean.
  
* *visibility*

  	string - Can be set to either `"searchable"` or `"hidden"`.

  	`"searchable"` means anyone can find your group on the discover page in the app,

  	`"hidden"` means it can only be found via its share URL.
  
* *group_type*

  	string - Can be set to `"closed"`, `"private"`, or `"announcement"`.
  
  	`"closed"` means only admins can change settings for the group and manage the member list, anyone can send messages.
  
  	`"private"` means anyone in the group can manage settings and the roster, anyone can send messages.
  
  	`"announcement"` means only admins will be able to manage settings and the roster, only admins are allowed to send messages.
  
* *message_deletion_mode*

  	array - Contains one or both `"admin"` and `"sender"` values. These are pretty self explanitory. If left empty, nobody will be able to delete messages.
  
```json linenums="1" title="HTTP Response"
Status: 200 OK
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
}
```

***

## Destroy
Disband a group

This action is only available to the group creator

```json linenums="1" title="HTTP Request"
POST /groups/:group_id/destroy
```

```json linenums="1" title="HTTP Response"
Status: 200 OK
```

***

## Join
Join a shared group

```json linenums="1" title="HTTP Request"
POST /groups/:id/join/:share_token
```

```json linenums="1" title="Response"
Status: 200 OK
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
  }
}
```

***

## Rejoin

Rejoin a group. Only works if you previously removed yourself.

```json linenums="1" title="HTTP Request"
POST /groups/join
```

**Parameters**

* *group_id* (required)

	string - the ID of the group to join


```json linenums="1" title="HTTP Response"
Status: 200 OK
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
}
```

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

```json linenums="1" title="HTTP Request"
POST /groups/change_owners
```

**Parameters**

* *requests* (required)

	array - One request is object where user_id is the new owner who must be active member of a group specified by group_id.
	
* *object*

	* *group_id* (required)
	
		string - The ID of the affected group
		
	* *owner_id* (required)
	
		string - The ID of the person to be made owner

```json linenums="1" title="HTTP Response"
Status: 200 OK
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
}
```

***

## Mute/Unmute Main Channel

Silence general notifications for the main chat in a group. This does not silence @mentions, replies, or reaction notifications for your own messages.

Both calls return your member object for the group.

> [!important]
> This request is relative to `https://v2.groupme.com/`, not `https://api.groupme.com/v3/`.

```json linenums="1" title="HTTP Request (To mute)"
POST https://v2.groupme.com/groups/:group_id/memberships/mute
{
  "duration": 60
}
```

**Parameters**

* *duration* (required)

	string - The length of time (in minutes) you want notifications to be silent for. To silence notifications until you enable them again, use `null`.

```json linenums="1" title="HTTP Request (To unmute)"
POST https://v2.groupme.com/groups/:group_id/memberships/unmute
```

```json linenums="1" title="HTTP Response (For both muting and unmuting)"
Status: 200 OK
{
  "membership": {
    "id": "1080225494",
    "user_id": "93645911",
    "nickname": "Isaac",
    "avatar_url": "https://i.groupme.com/200x200.jpeg.94e0ac5891aa4e6f8ad4bbf961defe4d",
    "state": "muted",
    "created_at": 1748635698,
    "updated_at": 1748664739,
    "muted_until": 253402300800,
    "has_sound_enabled": true,
    "autokicked": false
  }
}
```

***

## Mute/Unmute Main Channel and Topics

Silence general notifications for the main chat in a group, as well as all of the subtopics. This does not silence @mentions, replies, or reaction notifications for your own messages.

Both calls return your member object for the group, Note that because this is a /v3 call instead of /v2, the member object is slightly different than it is when you mute the main chat on its own.

```json linenums="1" title="HTTP Request (To mute)"
POST /v3/groups/:group_id/memberships/mute_all
{
  "duration": 60
}
```

**Parameters**

* *duration* (required)

	string - The length of time (in minutes) you want notifications to be silent for. To silence notifications until you enable them again, use `null`.

```json linenums="1" title="HTTP Request (To unmute)"
POST /groups/:group_id/memberships/unmute_all
```

```json linenums="1" title="HTTP Response (For both muting and unmuting)"
Status: 200 OK
{
  "membership": {
    "id": "1080225494",
    "user_id": "93645911",
    "country_code": "1",
    "phone_number": "3192414622",
    "email": "stanger.isaac@gmail.com",
    "avatar_url": "https://i.groupme.com/200x200.jpeg.94e0ac5891aa4e6f8ad4bbf961defe4d",
    "nickname": "Isaac",
    "creator": true,
    "muted": true,
    "snoozed": false,
    "has_sound_enabled": true,
    "pending": false,
    "muted_until": 253402300800,
    "muted_children": {
      "107933452": 253402300800
    }
  }
}
```

***
