---
title: "Subtopics"
description: "Learn how to interact with GroupMe's subtopic system via the API."
---

# Subtopics

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

## Index

List the authenticated user's active subgroups under a certain parent group.

The response is paginated. It is assumed that the default is 10 groups per page, but it is unlikely for a group to have 10 subgroups anyways, so this has not been tested. 

Adding `&omit=memberships` to the end of your request URL doesn't return an error, but as of now the responses don't include an array of members anyways. 

**Request**
```json
GET /groups/:id/subgroups
```

**Parameters**

  The following parameters are assumed to match the behavior of `groups`. More testing is needed to determine if these default values match up exactly, so take these as a best guess.

* *id* (required)

  string - the ID of the parent group to get the subgroups for

* *page*

  integer - Fetch a particular page of results. Defaults to 1.

* *per_page*

  integer - Define page size. Defaults to 10. 

* *omit*

  string - Comma separated list of data to omit from output. Currently supported value is only "memberships". If used then response will contain empty (null) members field.

**Responses**
```json
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

**Request**

```json
GET /groups/:parent_group_id/subgroups/:id
```

**Parameters**

* *parent_group_id* (required)

  string - the ID of the parent group to get the subgroup for

* *id* (required)

  string - the ID of the subgroup to show details of

**Responses**
```json
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

## POST Methods

**This documentation is a work in progress. It is assumed (but not yet guaranteed) that the POST methods that work on `groups` also work here, just with the added `parent_id` parameter.**
