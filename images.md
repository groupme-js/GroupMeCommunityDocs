---
title: "Image Service"
description: "Learn how to interact with GroupMe's Image Service via the API."
---

## Image Service

Images uploaded to the GroupMe Image CDN will have URLs that look like this: 

```https://i.groupme.com/{width}x{height}.{format}.{id}```

Where {width} and {height} are in pixels, {format} is for example "png" or "jpeg" and {id} is a unique id e.g.

```https://i.groupme.com/480x325.jpeg.9e20b71dd6af4b58bbd132d4a7dec009```

## To try this out via cURL:

Store your access token in the GM_TOKEN environment variable first.

```bash linenums="1"
curl 'https://image.groupme.com/pictures' -X POST -H "X-Access-Token: $GM_TOKEN" -H "Content-Type: image/jpeg" --data-binary @AwesomePicture.jpg
```

## Thumbnails

Images are automatically thumbnailed at the following sizes:

| **suffix** | **size**                                                   | **example**                                                       |
|------------|------------------------------------------------------------|-------------------------------------------------------------------|
| preview    | 200x200, centered and cropped                              | https://i.groupme.com/100x100.png.123456789.preview              |
| large      | 960x960, preserve aspect ratio so largest side is 960      | https://i.groupme.com/100x100.png.123456789.large                |
| avatar     | 60x60, centered and cropped                                | https://i.groupme.com/100x100.png.123456789.avatar               |

## Images

Nearly every instance of an image URL within the API **MUST** be processed by the Image CDN before it can be used. 

You can upload a variety of different kinds of image formats (including GIFs) to the image CDN in order for them to be processed, stored, and thumbnailed.
### Uploading local images

If you want to send an image you have stored locally, you first have to upload it to GroupMe's servers via their [image service](images.md). This is done with a simple request:

```json linenums="1" title="HTTP Request"
POST https://image.groupme.com/pictures
```

Importantly, this request MUST be done with the following headers:

* **Content-Type**: "image/jpeg" (For some reason it doesn't work with "image/png" as far as I can tell, but you can still send .png files under "image/jpeg")
* **Content-Length**: The size of your image in bytes
* **X-Access-Token**: Your user's token

Then, send the binary data of your image file. 

Issues with this feature are often caused by problems with the user token.

```json linenums="1" title="HTTP Response"
Status: 200 OK
{
  "payload": {
    "url": "https://i.groupme.com/123456789",
    "picture_url": "https://i.groupme.com/123456789"
  }
}
```

### Uploading remote images

If you want to send a remote image by its URL, you'll still have to upload it to GroupMe's servers via their [image service](images.md). This will behave similar to uploading local images, but with a new url parameter:

```json linenums="1" title="HTTP Request"
POST https://image.groupme.com/pictures?url=<image_url>
```

As far as I can tell, you only need to provide the **X-Access-Token** user token as a header.

**Response**

Your response will be of the same format as above:
```json linenums="1" titile="HTTP Response"
Status: 200 OK
{
  "payload": {
    "url": "https://i.groupme.com/123456789",
    "picture_url": "https://i.groupme.com/123456789"
  }
}
```
