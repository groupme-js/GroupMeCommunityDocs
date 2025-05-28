---
title: "File Management"
description: "Learn how to interact with GroupMe's file CDN via the API."
---

# Uploading Files to GroupMe
To upload a file to be processed to GroupMe's file service, POST to `https://file.groupme.com/v1/[GROUP_ID]/files?name=[FILE_NAME]` with the  following included in the HTTP header:

```json linenums="1"
Host: file.groupme.com
Content-Type: application/json
Accept-Encoding: gzip, deflate
Connection: close
X-Access-Token: [ACCESS_TOKEN]
```

Note that the content type is application/json, even though a data binary is going to be uploaded. Files must be less than 50MB to upload properly. Any file extension can be uploaded.

The file should be in the POST request as a data binary
The equivalent curl command is: 

```bash linenums="1"
curl -i -s -k -X "POST" -H "Host: file.groupme.com" -H "Content-Type: application/json" -H "X-Access-Token: [ACCESS_TOKEN]" -H "Accept-Encoding: gzip, deflate" -H "Connection: close" --data-binary @[FILE_NAME] https://file.groupme.com/v1/[GROUP_ID]/files?name=[FILE_NAME]
```

A properly uploaded file should have a response of `201 OK` to the previous request, along with a JSON object containing a job status id:
```json linenums="1"
{
  "status_url":  "https://file.groupme.com/v1/[GROUP_ID]/uploadStatus?job=[JOB_UUID]"
}
```

To get the status of a working job, GET `https://file.groupme.com/v1/[GROUP_ID]/uploadStatus?job=[JOB_UUID]`
A complete job will contain the following JSON in the response, with a header of `200 OK`:
```json linenums="1"
{
  "status":"complete",
  "file_id":"[FILE_ID]"
}
```

The completed file upload is ready to send as a file [attachment](attachments.md), using the `file_id` as a reference to the uploaded file. Files uploaded to one group may not be shared to another group
