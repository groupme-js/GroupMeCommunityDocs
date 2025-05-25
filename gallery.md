---
title: "Image Galleries"
description: "Learn how to interact with GroupMe's channel-specific image galleries via the API."
---

# Image Gallery

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

List a Group or DM conversation's previous *messages* that contain images or files stored in the Gallery.

The response is paginated (sort of), with a default of 100 images per page. Specifying a `before` timestamp allows you to fetch beyond the first page of results.

**Request**
```json
GET /conversations/:conversation_id/gallery
```

**Parameters**

* *acceptFiles*

  boolean - A flag to tell the image service your client is capable of receiving non-image files. Setting this value to `0` or omitting it entirely will NOT omit messages with file attachments in the response; these messages will still be included, but the text property will be overwritten with `Please upgrade to download this file.` The file attachment will still be fully intact, however. In practice this means that if you care about the text in the message with an attachment, you should set `acceptFiles=1`.
	
* *limit*

	integer - Defines page size. Defaults to 100.

* *before*

  string - A timestamp in ISO 8601 format denoting the latest image timestamp to include in the response. This is used for pagination: the server will return images older than this timestamp. If omitted, it fetches the most recent images.

* *after*

  string - A timestamp in ISO 8601 format denoting the oldest image timestamp to include in the response. This is used for pagination: the server will return images newer than this timestamp. Can be used with or without the `before` parameter.
	
**Responses**
```json
Status: 200 OK
{
  "messages": [
    {
      "attachments": [
        {
          "type": "image",
          "url": "https://i.groupme.com/274x184.jpeg.6a3a12a63bb4453ea085e29c76825830"
        }
      ],
      "avatar_url": "https://i.groupme.com/184x184.jpeg.63692bfcaa18457eaeaa1dbde8cecb6d",
      "created_at": 1747233197,
      "favorited_by": [
        "103829605"
      ],
      "gallery_ts": "2025-05-14T14:33:17.8688Z",
      "group_id": "98296943",
      "id": "174723319786892122",
      "name": "jack",
      "sender_id": "112904724",
      "sender_type": "user",
      "source_guid": "B5562890-BCCF-457F-B07D-3FDAB8C773EE",
      "system": false,
      "text": null,
      "user_id": "115904724"
    },
    {
      "attachments": [
        {
          "type": "image",
          "url": "https://i.groupme.com/542x606.jpeg.10f96a004a52451192a673a38371cfac"
        }
      ],
      "avatar_url": "https://i.groupme.com/1024x1024.jpeg.52f411008b064201932e9cf98a3d407a",
      "created_at": 1747227084,
      "favorited_by": [],
      "gallery_ts": "2025-05-14T12:51:24.7745Z",
      "group_id": "98296943",
      "id": "174722708477454148",
      "name": "alice",
      "sender_id": "130870470",
      "sender_type": "user",
      "source_guid": "19472C2B-5DE2-4BD4-A3E3-783BDFC9976C",
      "system": false,
      "text": null,
      "user_id": "130850470"
    }
  ]
}
```
***
