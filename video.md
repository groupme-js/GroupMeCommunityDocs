# Uploading Your Own Video to the Video Service
To upload a video to be processed to GroupMe's video processing service, POST to `https://video.groupme.com/transcode` with the  following included in the HTTP header:

```
Content-Type: multipart/form-data;boundary=[MIME_BOUNDARY]
X-Conversation-Id: [GROUP_ID]
X-Access-Token: [ACCESS_TOKEN]
```

Note: if you are using some kind of library to send the file, you shouldn't have to worry about the content type, as the library should handle that part for you.

The video should be in the POST request as multipart/form-data file
The equivalent curl command is: 

```bash
curl 'https://video.groupme.com/transcode' -X POST -H "X-Access-Token: [ACCESS_TOKEN]" -H "X-Conversation-Id: [GROUP_ID]" --form file="@[FILE_NAME]"
```

A properly uploaded video should have a response of `200 OK` to the previous request, along with a JSON object containing a job status id:
```json
{
  "status_url":"https://video.groupme.com/status?job=[JOB_UUID]"
}
```

To get the status of a working job, GET `https://video.groupme.com/status?job=[JOB_UUID]`
A complete job will contain the following JSON in the response, with a header of `201 Created`:
```json
{
  "status":"complete",
  "url":"[VIDEO_URL]",
  "thumbnail_url":"[THUMB_IMAGE_URL]"
}
```

The completed video upload is ready to send as an [attachment](attachments.md)
