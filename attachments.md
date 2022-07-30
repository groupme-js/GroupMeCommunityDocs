# Attachments

When sending messages in groups or DM channels, users (or bots) can add any number of attachments, as noted in the relevant sections of [Group Messages](messages.md), [Direct Messages](dms.md), and [Bots](bots.md). In each of these instances, you add an attachment by including a corresponding object in the "attachments" array. This section will list all the different types of attachments possible (That we know of and can find documentation for) and how to send them.

All parameters are required unless otherwise specified.

***

## Images

**Object structure**
```
{
	"type": "image",
	"url": "https://i.groupme.com/123456789"
}
```

**Parameters**

* *type*

	string - must be "image" for an image attachment

* *url*

	string - the URL of the image to send. This does need to be an i.groupme.com URL.
### Uploading local images

If you want to send an image you have stored locally, you first have to upload it to GroupMe's servers via their [image service](https://dev.groupme.com/docs/image_service). This is done with a simple request:

```
POST https://image.groupme.com/pictures
```

Importantly, this request MUST be done with the following headers:

* **Content-Type**: "image/jpeg" (For some reason it doesn't work with "image/png" as far as I can tell, but you can still send .png files under "image/jpeg")
* **Content-Length**: The size of your image in bytes
* **X-Access-Token**: Your user's token

Then, send the binary data of your image file. 

Issues with this feature are often caused by problems with the user token.

**Response**
```
Status: 200 OK
{
  "payload": {
    "url": "https://i.groupme.com/123456789",
    "picture_url": "https://i.groupme.com/123456789"
  }
}
```

### Uploading remote images

If you want to send a remote image by its URL, you'll still have to upload it to GroupMe's servers via their [image service](https://dev.groupme.com/docs/image_service). This will behave similar to uploading local images, but with a new url parameter:

```
POST https://image.groupme.com/pictures?url=<image_url>
```

As far as I can tell, you only need to provide the **X-Access-Token** user token as a header.

**Response**

Your response will be of the same format as above:
```
Status: 200 OK
{
  "payload": {
    "url": "https://i.groupme.com/123456789",
    "picture_url": "https://i.groupme.com/123456789"
  }
}
```

***

## Video

**Object Structure**
```
{
"type":"video",
"url":"https://v.groupme.com/123456/2021-12-11T16:33:43Z/9999a999.1280x720r90.mp4",
"preview_url":"https://v.groupme.com/123456/2021-12-11T16:33:43Z/9999a999.1280x720r90.jpg"
}
```
**Parameters**

 - *type*
 
	 string - must be "video" for a video attachment
	 
 - *url*
 
	 string - URL to video file, does not have to be a `v.groupme.com` link, though it would probably make the devs happy if it was
	 
- *preview_url*

	string - URL to video file thumbnail, again it does not need to (but probably should be) a `v.groupme.com` link. Note that thumbnail images produced by the video service are not `i.groupme.com` links.
	
	


***


## File

**Object Structure**
```
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

**Object structure**
```
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

**Object structure**
```
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

**Object structure**
```
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

**Object structure**
```
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

## Split

This seems to be entirely deprecated, but the official docs still mention it, so I'll bring it up here too.

Split seems to be some sort of payment processer, where you can easily send 

**Object structure**
```
{
	"type": "split",
	"token": "SPLIT_TOKEN"
}
```

**Parameters**

* *type*

	string - must be "split" for a Split attachment
	
* *token*

	string - the token associated with your Split transaction. Must be generated through Split's service, if it still exists.
