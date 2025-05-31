---
title: "Subtopics"
description: "Learn how to interact with GroupMe's subtopic system via the API."
---

# Subtopics

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

List the authenticated user's active subgroups under a certain parent group.

```json linenums="1" title="HTTP Request"
GET /groups/:group_id/subgroups
```

**Parameters**

  The following parameters are assumed to match the behavior of `groups`. More testing is needed to determine if these default values match up exactly, so take these as a best guess.

* *group_id* (required)

  string - the ID of the parent group to get the subgroups for

* *page*

  integer - Fetch a particular page of results. Defaults to 1.

* *per_page*

  integer - Define page size. Defaults to 10. 


```json linenums="1" title="HTTP Response"
Status: 200 OK
[
  {
    "messages": {
      "count": 4,
      "last_message_id": "1234567890987654321",
      "last_message_created_at": 1715574721,
      "last_message_updated_at": 1715574721,
      "preview": {
        "nickname": "Bob Doe",
        "text": "Hello everyone!",
        "image_url": "https://i.groupme.com/1024x1024.jpeg.123456789e9876543211234567e",
        "attachments": [
          {
            "type": "image",
             "url": "https://i.groupme.com/123456789"
          },
          {
            "type": "image",
            "url": "https://i.groupme.com/123456789"
          }
        ]
      }
    },
    "id": 123456789,
    "parent_id": 123123123,
    "topic": "Test Topic 1",
    "description": "This is a testing topic",
    "avatar_url": "https://i.groupme.com/1024x1024.jpeg.123456789a9876543211234567a",
    "creator_user_id": 12345678,
    "created_at": 1715574084,
    "updated_at": 1715574721,
    "muted_until": null,
    "like_icon": null,
    "unread_count": null,
    "last_read_message_id": null,
    "last_read_at": null
  }
]
```

***

## Show

Load a specific subgroup within a parent group.

```json linenums="1" title="HTTP Request"
GET /groups/:group_id/subgroups/:subgroup_id
```

**Parameters**

* *group_id* (required)

  string - the ID of the parent group to get the subgroup for

* *subgroup_id* (required)

  string - the ID of the subgroup to show details of

```json linenums="1" title="HTTP Response"
Status: 200 OK
{
  "messages": {
    "count": 18,
    "last_message_id": "1234567890987654321",
    "last_message_created_at": 1715574721,
    "last_message_updated_at": 1715574721,
    "preview": {
      "nickname": "Jane Doe",
      "text": "Hey everyone!",
      "image_url": "https://i.groupme.com/1024x1024.jpeg.eabcdefg1234567654321eabcdefg",
      "attachments": [
        {
          "type": "image",
          "url": "https://i.groupme.com/123456789"
        },
        {
          "type": "image",
          "url": "https://i.groupme.com/123456789"
        }
      ]
    }
  },
  "id": 123456789,
  "parent_id": 987654321,
  "topic": "Test Topic",
  "description": "This is a testing topic",
  "avatar_url": "https://i.groupme.com/1024x1024.jpeg.iabcdefg1234567654321iabcdefg",
  "creator_user_id": 123123123,
  "created_at": 1715574084,
  "updated_at": 1715574721,
  "muted_until": null,
  "like_icon": null,
  "unread_count": null,
  "last_read_message_id": null,
  "last_read_at": null
}
```

***

## Create

Create a topic. You must be an admin in the group to make this call.

```json linenums="1" title="HTTP Request"
POST /groups/:group_id/subgroups
{
  "avatar_url": "https://i.groupme.com/1024x1024.jpeg.679caf2a3dc04bd884137065e567047f",
  "description": "this is a description",
  "group_type": "announcement",
  "topic": "test topic"
}
```

**Parameters**

* *group_id* (required)

  string - the ID of the parent group to get the subgroup for

* *avatar_url*

  string - an Image URL for the topic processed by GroupMe's Image Service

* *description*

  string - the description for the topic

* *group_type*

  string - can be either `"private"` (anyone can post to this topic) or `"announcement"` (only admins can post to this topic)

* *topic*

  string - the name of the new topic

```json linenums="1" title="HTTP Response"
Status: 201 Accepted
{
  "id": 107877040,
  "topic": "test topic",
  "type": "announcement",
  "description": "this is a description",
  "avatar_url": "https://i.groupme.com/1024x1024.jpeg.679caf2a3dc04bd884137065e567047f",
  "created_at": 1748457450,
  "updated_at": 1748457450,
  "parent_id": 107876923,
  "like_icon": null
}
```

***

## Update

Update a topic's details

```json linenums="1" title="HTTP Request"
PUT /groups/:group_id/subgroups/:subgroup_id
{
  "avatar_url": "https://i.groupme.com/1024x1024.jpeg.679caf2a3dc04bd884137065e567047f",
  "description": "this is a new description",
  "group_type": "private",
  "topic": "new name",
	"like_icon": {
		"pack_id": 1,
		"pack_index": 49,
		"type": "emoji"
	}
}
```

**Parameters**

* *group_id* (required)

  string - the ID of the parent group to get the subgroup for

* *subgroup_id* (required)

    string - the ID of the topic you want to update
  
* *avatar_url*

  string - an Image URL for the topic processed by GroupMe's Image Service

* *description*

  string - the description for the topic

* *group_type*

  string - can be either `"private"` (anyone can post to this topic) or `"announcement"` (only admins can post to this topic)

* *topic*

  string - the name of the new topic

* *like icon*

  object - The GroupMe powerup emoji to set as the group's like icon. See the [emoji documentation](emoji.md) for more information on what these values mean.

```json linenums="1" title="HTTP Response"
{
  "id": 107877040,
  "topic": "new name",
  "type": "private",
  "description": "this is a new description",
  "avatar_url": "https://i.groupme.com/1024x1024.jpeg.742b941f7eea46998438cee6838268ec",
  "created_at": 1748457450,
  "updated_at": 1748457988,
  "parent_id": 107876923,
  "like_icon": {
    "pack_id": 1,
    "pack_index": 49,
    "type": "emoji"
  }
}
```

***

## Delete

Delete a topic

```json linenums="1" title="HTTP Request"
DELETE /groups/:group_id/subgroups/:subgroup_id
```

**Parameters**

* *group_id* (required)

  string - the ID of the parent group to get the subgroup for

* *subgroup_id* (required)

    string - the ID of the topic you want to update

```json linenums="1" title="HTTP Response"
Status: 200 OK
```

## Mute/Unmute a specific Topic

Silence general notifications for the main chat in a group, as well as all of the subtopics. This does not silence @mentions, replies, or reaction notifications for your own messages.

Both calls return your member object for the group.

```json linenums="1" title="HTTP Request (To mute)"
POST /groups/:group_id/subgroups/:subgroup_id/mute
{
  "duration": 60
}
```

**Parameters**

* *duration* (required)

	string - The length of time (in minutes) you want notifications to be silent for. To silence notifications until you enable them again, use `null`.

```json linenums="1" title="HTTP Request (To unmute)"
POST /groups/:group_id/subgroups/:subgroup_id/unmute
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
    "muted": false,
    "snoozed": false,
    "has_sound_enabled": true,
    "pending": false,
    "muted_until": null,
    "muted_children": {
      "107933452": 253402300800
    }
  }
}
```

***
