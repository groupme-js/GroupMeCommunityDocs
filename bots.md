---
title: "Webhook Bots"
description: "Learn how to interact with GroupMe webhooks via the API."
---

# Webhook Bots

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

# Important notes

The bots described in this page are what GroupMe describes as "bots". These bots have serious limitations, including but not limited to:

1. They cannot like messages

2. They cannot be in more than one group

3. They cannot be DM'd (Though they can be attached to their creator's DMs)

4. They cannot read previous messages or any other data in a group - they only have access to a message once, when it's sent to it via the callback URL.

These limitations can produce incredibly powerful and interesting bots, and if your application can deal with these limitations, it's generally safer to use this style of bot. However, if your application needs to be able to do more than that, it may be a better idea to simply create a new user with a different email and phone number, and automate that account by connecting it to GroupMe's push service, and using the rest of the API to do things like create groups, send messages, etc. An example of this (Perhaps not a good example, but an example nonetheless) is [my primary bot, Lowes](https://github.com/2CATteam/gmuserbot). If you have a better, better-documented example, feel free to submit a pull request changing this section.

Lastly, while GroupMe does offer API endpoints for creating, destroying, and indexing bots, and these are documented below, they also offer [a web form for managing them](https://dev.groupme.com/bots/), so you should probably use that to do that unless you need to automate these tasks. They also have an official [bot tutorial](https://dev.groupme.com/tutorials/bots) and a [bot sample project](https://github.com/groupme/bot-tutorial-nodejs), so if you're just beginning to play around with bots and APIs, you may find those useful.

***

## Create

Create a bot. The response will include your bot_id - do NOT publish or let anyone else see this! Anyone with this will be able to send messages using your bot!

**Request**
```json
POST /bots
{
	"bot": {
		"name": "Dasani Bot",
		"group_id": "1234567890",
		"avatar_url": "https://assets.bwbx.io/images/users/iqjWHBFdfxIU/ipvgzU.b0q4M/v0/1000x-1.jpg",
		"callback_url": "https://example.herokuapp.com/",
		"dm_notification": false
	}
}
```

**Parameters**

* *bot* (required)

	object - an object with the following properties:
	
	* *name* (required)
	
		string - the name the bot will show up with
		
	* *group_id* (required)
	
		string - the id of the chat the bot should be active in
		
	* *avatar_url*
	
		string - a URL to an image which will be the bot's avatar. This image MUST be proccessed by GroupMe's [Image Service](images.md) before it can be sent.
		
	* *callback_url*
	
		string - if provided, whenever the bot receives a message, it will be sent as a POST request to this URL.
		
**Responses**
```json
Status: 201 Created
{
  "bot_id": "1234567890",
  "group_id": "1234567890",
  "name": "Dasani Bot",
  "avatar_url": "https://assets.bwbx.io/images/users/iqjWHBFdfxIU/ipvgzU.b0q4M/v0/1000x-1.jpg",
  "callback_url": "https://example.herokuapp.com/",
  "dm_notification": false
}
```

***

## Send Message

Post a message from a bot

**Request**
```json
POST /bots/post
{
	"bot_id": "1234567890",
	"text": "Hello World",
	"attachments": [
		{
			"type": "image",
			"url": "https://i.groupme.com/123456789"
		}
	]
}
```

**Parameters**

* *bot_id* (required)

	string - the ID of the bot.
	
* *text* (required)

	string - maximum length of 1000 character
	
* *attachments*

	array - A polymorphic list of attachments (locations, images, replies, etc). You may have more than one of any type of attachment, provided clients can display it.
	
	For more information on types of attachments and how to send them, check out the [attachments documentation](attachments.md)

**Responses**
```json
Status: 201 Created
```

***

## Index

List bots that you have created. The response will include multiple `bot_id`s - do NOT publish these or let anyone else see these! Anyone with this will be able to send messages using your bot!

**Request**
```json
GET /bots
```

**Responses**
```json
Status: 200 OK
[
  {
    "bot_id": "1234567890",
    "group_id": "1234567890",
    "name": "hal9000",
    "avatar_url": "https://i.groupme.com/123456789",
    "callback_url": "https://example.com/bots/callback",
    "dm_notification": false
  }
]
```

***

## Destroy

Remove a bot that you have created

**Request**
```json
POST /bots/destroy
```

**Parameters**

* *bot_id* (required)

**Responses**
```json
Status: 200 OK
```
