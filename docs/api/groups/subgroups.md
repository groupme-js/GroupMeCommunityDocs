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

!!! warning
    **Type Inconsistency:** Unlike most GroupMe endpoints which use string IDs, the subgroup endpoints return `id`, `parent_id`, and `creator_user_id` as **integers**, not strings. This is an inconsistency with the rest of the API where IDs are typically strings.

!!! note
  Subgroup message retrieval uses the flat group-style endpoint:

  GET /groups/{subgroup_id}/messages

  even though subgroup metadata is accessed via:

  GET /groups/{group_id}/subgroups/{subgroup_id}

  This distinction was verified via live API testing.

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
      "last_message_id": "1234567890",
      "last_message_created_at": 1302623328,
      "last_message_updated_at": 1302623328,
      "preview": {
        "nickname": "John",
        "text": "Hello everyone!",
        "image_url": "https://i.groupme.com/123456789",
        "attachments": [
          {
            "type": "image",
            "url": "https://i.groupme.com/123456789"
          }
        ]
      }
    },
    "id": 123456789,
    "parent_id": 123456789,
    "topic": "Test Topic 1",
    "description": "This is a testing topic",
    "avatar_url": "https://i.groupme.com/123456789",
    "creator_user_id": 12345678,
    "created_at": 1302623328,
    "updated_at": 1302623328,
    "muted_until": null,
    "recap_enabled": null,
    "like_icon": null,
    "unread_count": null,
    "last_read_message_id": null,
    "last_read_at": null,
    "message_edit_period": 15
  }
]
```

***

!!! note
  The subgroup `messages` object includes `last_message_updated_at`, which is not present in standard group message metadata. This field represents when the last message was edited or otherwise updated.

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
    "last_message_id": "1234567890",
    "last_message_created_at": 1715574721,
    "last_message_updated_at": 1715574721,
    "preview": {
      "nickname": "Jane",
      "text": "Hey everyone!",
      "image_url": "https://i.groupme.com/123456789",
      "attachments": [
        {
          "type": "image",
          "url": "https://i.groupme.com/123456789"
        }
      ]
    }
  },
  "id": 123456789,
  "parent_id": 123456789,
  "topic": "Test Topic",
  "description": "This is a testing topic",
  "avatar_url": "https://i.groupme.com/123456789",
  "creator_user_id": 12345678,
  "created_at": 1302623328,
  "updated_at": 1302623328,
  "muted_until": null,
  "recap_enabled": null,
  "like_icon": null,
  "unread_count": null,
  "last_read_message_id": null,
  "last_read_at": null,
  "message_edit_period": 15
}
```

***

## Create

Create a topic. You must be an admin in the group to make this call.

```json linenums="1" title="HTTP Request"
POST /groups/:group_id/subgroups
{
  "avatar_url": "https://i.groupme.com/123456789",
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
  "id": 123456789,
  "topic": "test topic",
  "type": "announcement",
  "description": "this is a description",
  "avatar_url": "https://i.groupme.com/123456789",
  "creator_user_id": 12345678,
  "created_at": 1302623328,
  "updated_at": 1302623328,
  "parent_id": 123456789,
  "message_edit_period": 15,
  "like_icon": null
}
```

***

## Update

Update a topic's details

```json linenums="1" title="HTTP Request"
PUT /groups/:group_id/subgroups/:subgroup_id
{
  "avatar_url": "https://i.groupme.com/123456789",
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

  object - The GroupMe powerup emoji to set as the group's like icon. See the [emoji documentation](../common/emoji.md) for more information on what these values mean.

```json linenums="1" title="HTTP Response"
{
  "id": 123456789,
  "topic": "new name",
  "type": "private",
  "description": "this is a new description",
  "avatar_url": "https://i.groupme.com/123456789",
  "creator_user_id": 12345678,
  "created_at": 1302623328,
  "updated_at": 1302623328,
  "parent_id": 123456789,
  "message_edit_period": 15,
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
    "id": "1234567890",
    "user_id": "123456789",
    "country_code": "1",
    "phone_number": "1234567890",
    "email": "user@example.com",
    "avatar_url": "https://i.groupme.com/123456789",
    "nickname": "John",
    "creator": true,
    "muted": false,
    "snoozed": false,
    "has_sound_enabled": true,
    "pending": false,
    "muted_until": null,
    "muted_children": {
      "123456789": 253402300800
    }
  }
}
```

***
