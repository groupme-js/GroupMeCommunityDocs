---
title: "Attachments"
description: "Learn how to interact with GroupMe's message attachments viw the API."
---

# Attachments

When sending messages in groups or DM channels, users (or bots) can add any number of attachments, as noted in the relevant sections of [Group Messages](messages.md), [Direct Messages](dms.md), and [Bots](bots.md). In each of these instances, you add an attachment by including a corresponding object in the "attachments" array. This section will list all the different types of attachments possible (That we know of and can find documentation for) and how to send them.

All parameters are required unless otherwise specified.

***

## Images

```json linenums="1" title="Object Structure"
{
  "type": "image",
  "url": "https://i.groupme.com/123456789"
}
```

**Parameters**

* *type*

	string - must be "image" for an image attachment

* *url*

	string - the URL of the image to send. This image must first be processed by GroupMe's [Image Service](images.md)

***

## Video

```json linenums="1" title="Object Structure"
{
  "type": "video",
  "url": "https://v.groupme.com/123456/2021-12-11T16:33:43Z/9999a999.1280x720r90.mp4",
  "preview_url": "https://v.groupme.com/123456/2021-12-11T16:33:43Z/9999a999.1280x720r90.jpg"
}
```
**Parameters**

 - *type*
 
	 string - must be "video" for a video attachment
	 
 - *url*
 
	 string - URL to video file, needs to be a `v.groupme.com` link.
	 
- *preview_url*

	string - URL to video file thumbnail, again it does need to `v.groupme.com` link. Note that thumbnail images produced by the video service are not `i.groupme.com` links.
	
***

## File

```json linenums="1" title="Object Structure"
{
  "type":"file",
  "file_id":"abcdabcd-dead-beef-2222-111122223333"
}
```
**Parameters**

 - *type*
 
	 string - must be "file" for a file attachment
	 
 - *url*
 
	 file_id - valid file id from the [file service](files.md)
	 
***

## Location

```json linenums="1" title="Object Structure"
{
  "type": "location",
  "name": "Heaven?",
  "lat": "64.148430",
  "lng": "-21.9355508"
}
```

**Parameters**

* *type*

	string - must be "location" for a location attachment

* *name*

	string - the name of the location you're sending

* *lat*

	string - the latitude of the location
	
* *lng*

	string - the longitude of the location.

***

## Emoji

Only for GroupMe-specific emoji. Standard Unicode emoji (e.g. 💩) do not use this feature.

```json linenums="1" title="Object Structure"
{
  "type": "emoji",
  "placeholder": "�",
  "charmap": [[1, 62]]
}
```

**Parameters**

* *type*

	string - must be "emoji" for an emoji attachment

* *placeholder*

	string - a placeholder character in the text which is meant to be replaced by the actual emoji.
	
	* This can technically be more than one character, but different platforms are inconsistent about how they display the resulting message - some will delete the entire placeholder string, others will only delete the first character
	
* *charmap*

	array - an array of arrays of two integers. That is, an array of the form `[[1, 62], [2, 0]]`.
	
	* Each number pair represents one emoji, in the order the placeholder character appears.
	
	* The first number is the number of the emoji pack the emoji is found in (starting at one), and the second number is the position of the emoji in the array (starting at zero)
	
	* The first placeholder will be replaced by the emoji indicated by the first charmap, the second placeholder will be replaced by the second, and so on.
	
	* If there are more placeholder characters than there are charmaps, platforms are inconsistent on how they handle it. Some will render the placeholder, some will render a random emoji.
	
	* If there are fewer placeholder characters than there are charmaps, the extra charmaps will simply be discarded.

***

## Replies

Designates a message as a reply to a previous message

```json linenums="1" title="Object Structure"
{
  "type": "reply",
  "reply_id": "123456789",
  "base_reply_id": "123456789"
}
```

**Parameters**

* *type*

	string - must be "reply" for a reply attachment

* *reply_id*

	string - the ID of the message you're responding to. Must be greater than or equal to base_reply_id.
	
	* This can be omitted, but will result in some clients being inconsistent of if they recognize it as a reply or not.
	
	* If this is included, and reply_id and base_reply_id differ, this takes precedence

* *base_reply_id*

	string - the ID of the message you're responding to.

***

## Mentions

This is how you @mention someone.

```json linenums="1" title="Object Structure"
{
  "type": "mentions",
  "user_ids": ["123456789", "1234567890"],
  "loci": [[0, 6], [8, 6]]
}
```

**Parameters**

* *type*

	string - must be "mentions" for a mention attachment

* *user_ids*

	array - an array of the user IDs being mentioned.

* *loci*

	array - an array of arrays of two integers. That is, an array of the form `[[0, 6], [8, 6]]`
	
	* Each number pair represents a mention to the person specified in the associated `user_ids` element
	
	* The first number represents the position in the text where the mention begins, and the second represents how long it is.
	
		So, for example, in the message "Hi @Lowes", the first number would be 3, and the second number would be 6.
		
Interestingly, because of this system, you don't have to actually type someone's name, or even type @, for someone to be mentioned. There's also no limit on how many people you can @mention at once. My bot, Lowes, has a function which simply says "@all" and everyone in the chat gets the notification that they've been mentioned.

***

# Read Only Attachments

> [!note]
> These attachment types cannot be sent in a message's attachments array and can only be observed through reading messages that have been sent in groups or direct messages. Most are added by the backend automatically.

***

## Poll

This is a read-only attachment type, as it is not sent in one of your messages. Rather, when you create a poll, a message with this attachment is sent for you. 

Read more about polls [here](polls.md)

```json linenums="1" title="Object Structure"
{
  "type": "poll",
  "poll_id": "1747858596203713"
}
```

**Parameters**

* *type*

	string - must be "poll" for a poll attachment

* *pool_id*

  	string - the ID of the poll attached to the message

***

## Calendar Event

This is a read-only attachment type, as it is not sent in one of your messages. Rather, when you create an event, a message with this attachment is sent for you. 

Read more about calendar events [here](calendar.md)

```json linenums="1" title="Object Structure"
{
  "type": "event"
  "event_id": "912fea48717643eda831e72306557100",
  "view": "full",
}
```

* *type*

	string - must be "event" for a callendar event attachment

* *event_id*

  	string - the ID of the event attached to the message

* *view*

	string - describes the way the event should be rendered in chat. This value has not been observed to be anything other than `"full"` so far.

## Copilot

This attachment type is read-only and used exclusively by Copilot in its messages to attach extra information about the Copilot interaction and the user that requested it.

```json linenums="1" title="Object Structure"
{
  "type": "copilot"
  "message_id": "u6Us5bXBSQERTNfc6vWGB",
  "part_id": "0",
  "prompt_sender": "93645911",
}
```

**Parameters**

* *type*

	string - must be "copilot" for a Copilot attachment
	
* *message_id*

	string - Copilot specific internal message ID, not the same as the GroupMe message ID

* *part_id*
  
  	string - the index of the message in the Coplilot response. Copilot can respond to a single query using multiple messages, this allows you to order them if there are more than one.

* *prompt_sender*

	string - the GroupMe user ID of the user who initiated the Copilot interaction

***
