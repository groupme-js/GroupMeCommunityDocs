# Pins

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

## Pin a message

Pins a message.

Note that trying to pin a message which is already pinned will result in an unhelpful 400 error. It may be difficult to programatically determine whether a given call fails due to an actual bad request, or if it's just because the message has already been pinned. For now, you just have to enumerate the pinned mesages and see if there's a match, or get the messatge object and see if the "pinned_at" field is null

**Request**
```json
POST /conversations/:conversation_id/messages/:message_id/pin
```

**Parameters**

* *conversation_id*

	string - The ID of the conversation. For groups, this is just the group ID, whereas for DMs, it's the DM ID, which is of the form `first_user_id+second_user_id` - so, for example, `1234+9876`. The lower ID seems to always be first.
	
* *message_id*

	string - The ID of the message to pin.
	
**Responses**

```json
Status: 200 OK
```

***

## Unpin a message

Unpins a message.

The same note on errors applies - trying to unpin a message which is not already pinned will result in an unhelpful 400 error.

**Request**
```json
POST /conversations/:conversation_id/messages/:message_id/unpin
```

**Parameters**

* *conversation_id*

	string - The ID of the conversation. For groups, this is just the group ID, whereas for DMs, it's the DM ID, which is of the form `first_user_id+second_user_id` - so, for example, `1234+9876`. The lower ID seems to always be first.
	
* *message_id*

	string - The ID of the message to unpin.
	
**Responses**

```json
Status: 200 OK
```

***

## List all pinned messages

List all of the pinned messages. The request varies slightly for groups and DMs, unlike the above methods.

**Request**

```json
GET /pinned/groups/:group_id/messages/`
```
```json
GET /pinned/direct_messages
```

**Parameters**

* *conversation_id* (required for groups)

	string - The ID of the conversation. For groups, this is just the group ID, whereas for DMs, it's the DM ID, which is of the form `first_user_id+second_user_id` - so, for example, `1234+9876`. The lower ID seems to always be first.

* *other_user_id* (required for DMs)

  string - The ID of the user (other than you) in the DM channel you're getting the Pins for
	
**Responses**

For groups:
```json
Status: 200 OK
{
  "count": 1,
  "messages": [
    {
      "id": "12345",
      "name": "Dasaniel Royer",
      "pinned_by": "54321",
      "pinned_at": 123312312
      ...
    }
  ]
}
```

For DMs:
```json
Status: 200 OK
{
  "count": 1,
  "messages": [
    {
      "id": "12345",
      "name": "Dasaniel Royer",
      "pinned_by": "54321",
      "pinned_at": 123312312
      ...
    }
  ]
}
```

For the full form of the message object, see [the Messages docs](messages.md). Note the new fields: `pinned_by` and `pinned_at`. `pinned_by` is the user who pinned it, and `pinned_at` is the timestamp (in seconds) of when it was pinned. When a message hasn't been pinned (which won't happen here, but will happen in other message-getting methods), `pinned_by` will be an empty string (`""`), and `pinned_at` will be `null`.

***
