---
title: "GroupMe Account Management"
description: "Learn how to interact with GroupMe's account management system via the API."
---

# Account Management

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

## About

Get details about the authenticated user

**Request**
```json
GET /users/me
```

**Responses**
```json
Status: 200 OK
{
  "id": "1234567890",
  "phone_number": "+1 2123001234",
  "image_url": "https://i.groupme.com/123456789",
  "name": "Ronald Swanson",
  "created_at": 1302623328,
  "updated_at": 1302623328,
  "email": "me@example.com",
  "sms": false
}
```

***

## Update Details

Update attributes about your own account

**Request**
```json
POST /users/update
{
  "avatar_url": "https://4.bp.blogspot.com/-GAeMYT8SZoI/TtBTK209xMI/AAAAAAAAWts/5nmvpmmvoWo/s1600/TopGun_059Pyxurz.jpg",
  "name": "Tom Skerritt",
  "email": "viper@topgun.usaf.mil",
  "zip_code": "92145"
}
```

**Parameters**

* *avatar_url*

	string — A valid image URL proccesed by GroupMe's [image service](https://dev.groupme.com/docs/image_service)
	
* *name*

	string — Name must be of the form FirstName LastName
	
* *email*

	string — Email address. Must be in name@domain.com form.
	
* *zip_code*

	string — Zip code.
	
**Responses**
```json
Status: 200 OK
{
  "id": "1234567890",
  "phone_number": "+1 2123001234",
  "image_url": "https://i.groupme.com/123456789",
  "name": "Ronald Swanson",
  "created_at": 1302623328,
  "updated_at": 1302623328,
  "email": "me@example.com",
  "sms": false
}
```

***

## Update Details (Alternative/Extended Method)

The GroupMe API technically allows for two different calls that update your profile details: the officially documented call to `/users/update` above, and also a more useful (but also unofficially documented) call to `https://v2.groupme.com/users/:your_user_id`. This second option is the one that all official clients currently use and seems to be the most current way clients update the newest addition to profiles, such as your profile gallery, theme song, bio, and intrest tags. 

Note: all of the parameters in this request are optional, however I'm including them all here as an example for verbosity.

> [!important]
> This request is relative to `https://v2.groupme.com/`, not `https://api.groupme.com/v3/`.

**Request**
```json
POST https://v2.groupme.com/users/:your_user_id
{
  "user": {
    "name": "Bilbo Baggins",
    "email": "example@email.com"
    "avatar_url": "https://i.groupme.com/200x200.jpeg.94e0ac5891aa4e6f8ad4bbf961defe4d",
    "bio": "Hello World!",
    "song_url": "https://open.spotify.com/track/4zu9wo2FXoBSsKjO6tRB3R?si=853de61130814a27",
    "photo_urls": [
      "https://i.groupme.com/790x1402.jpeg.ca86dade7dfb48168735247dce604499",
      "https://i.groupme.com/2270x4032.jpeg.0068aa02a4b949e0b97ab4dc8c9a31f7",
      "https://i.groupme.com/901x1600.jpeg.283ece1d0c9d41c180677393f78ff716"
    ],
    "intrests": [
      1005,
      1017,
      1026
    ],
    "disable_favorite_notification": true,
    "group_notification_sound": "gm6.wav",
    "dm_notification_sound": "gm16.wav"
  }
}
```
**Parameters**

* *name*

	string — Name must be of the form FirstName LastName, though a last name is not required

* *email*

	string — Email address. Must be in name@domain.com form.

* *avatar_url*

	string — A valid image URL processed by GroupMe's [image service](https://dev.groupme.com/docs/image_service)

* *bio*

  	string — A description of the profile.

* *song_url*

	string — Spotify song share URL for your profile's "theme song".

* *photo_urls*:

	array — An array of image urls processed by GroupMe's [image service](https://dev.groupme.com/docs/image_service) to be displayed in your profile's image gallery. You must have at least 3 for the API to accept them.
	
* *intrests*:

	array — an array of intrest tag indexes (as integers), these tags are new and not well documented (but this will hopefully change soon!).

* *disable_favorite_notification*:

	boolean — `true` to disable reaction notifications, `false` to enable them.

* *group_notification_sound*:

	string — the name of the WAV file to play when you receive a group notification on the Mobile App. These file names are internal to the app, so the options are not well documented.

* *dm_notification sound*

	string — the name of the WAV file to play when you receive a DM notification on the Mobile App. These file names are internal to the app, so the options are not well documented. (However they appear to be the same options as the ones availibe for the `group_notification_sound` parameter).

**Response**
```json
Status: 200 OK
{
  "user": {
    "id": "131245991",
    "created_at": 1747245002,
    "updated_at": 1747257736,
    "name": "Bilbo Baggins",
    "phone_number": "+1 2345678910",
    "email": "example@email.com",
    "avatar_url": null,
    "app_installed": true,
    "direct_message_capable": true,
    "country": null,
    "language": "en-US",
    "locale": "en_us",
    "disable_started_using_notification": false,
    "disable_favorite_notification": false,
    "sms_disabled": true,
    "sms_disabled_expires_at": null,
    "local_sms_available": true,
    "sleep_until": null,
    "needs_password": false,
    "stopped": false,
    "admin": false,
    "verified": true,
    "email_verified": false,
    "international": false,
    "email_settings": {
      "membership_added": true,
      "group_created": true
    },
    "group_notification_sound": "gm6.wav",
    "dm_notification_sound": "gm16.wav",
    "bio": "Hello World!",
    "photo_urls": [
      "https://i.groupme.com/790x1402.jpeg.ca86dade7dfb48168735247dce604499",
      "https://i.groupme.com/2270x4032.jpeg.0068aa02a4b949e0b97ab4dc8c9a31f7",
      "https://i.groupme.com/901x1600.jpeg.283ece1d0c9d41c180677393f78ff716"
    ],
    "song_url": "https://open.spotify.com/track/4zu9wo2FXoBSsKjO6tRB3R?si=S8-f5DNDTwGjHVBkixoDIQ",
    "interests": [
      1005,
      1017,
      1026
    ]
  }
}
```

***

## Update Major Tags

This call is only allowed for accounts that are members of a school domain, which is not an easy proccess to automate and thus will not be fully documented. HOWEVER, once you are in a domain, you have a few additional calls availible for your account.

**Request**
```json
PUT /directories/user/majors
{
  "codes": [
    "3702",
    "5506"
  ]
}
```

**Parameters**

* *codes*

	array — an array of Major indexes (as strings), these are numbers that represent the different options for Majors to choose from. The complete list of options alongside their indexes can be found at https://web.groupme.com/assets/majors/majors.en-US.json.

**Response**
```json
Status: 201 Accepted
[
  "3702",
  "5506"
]
```

***

## Set Graduation Year and Domain Visibility

This call is only allowed for accounts that are members of a school domain, which is not an easy proccess to automate and thus will not be fully documented. HOWEVER, once you are in a domain, you have a few additional calls availible for your account.

This call specifies your graduation year tag inside of your profile as well as what level of visibility you want your profile to be at within the campus domain.

**Request**
```json
PUT /directories/user/membership
{
  "graduation_year": 2025,
  "campus_profile_visibility": "major"
}
```

**Parameters**

* *graduation_year*

	integer — The year you'd like the tag to read. This number can't be less than `1900` or greater than `now + 10 years`. It can also be `null` if you do not wish for your graduation year to display on your profile.

* *campus_profile_visibility*

	string — The level of visibility you want your profile to be at within your domain directory. Can be `hidden` (nobody at all), `graduation_year`, `major`, or `visible` (everyone in your domain). `graduation_year` and `major` are not permitted unless you have specified a year or at least one major.

**Response**
```json
Status: 200 OK
{
  "id": 2990607,
  "user_id": 93645911,
  "directory_id": 1928,
  "campus_profile_visibility": "graduation_year",
  "graduation_year": "2025",
  "major_ids": [
    59,
    171
  ]
}
```

***

## Toggle Profile Sharing

Enables/disables your account's `share_url` and `share_qr_code_url` properties.

Turning this off and back on again generates a new URL every time and invalidates past ones that you may have shared.

**Request**
```json
POST /users/features/share
{
  "status": "enable"
}
```

**Parameters**

* *status*

    String - Can be set to `enable` or `disable`, enable generates a share URL for your profile, disable invalidates it.

**Response**
```json
Status: 200 OK
{
  "share_url": "https://groupme.com/contact/74938777/OtzZPXiX",
  "share_qr_code_url": "https://image.groupme.com/qr/contact/74938777/OtzZPXiX/preview"
}
```

***

## Enable SMS mode

Enables SMS mode for N hours, where N is at most 48. After N hours have elapsed, user will receive push notfications.

**Request**
```json
POST /users/sms_mode
{
  "duration": 4,
  "registration_id": "TOKEN"
}
```

**Parameters**
* *duration* (required)

	integer - the number of hours to be in SMS mode for. Max of 48. Alternatively can be set to `"always"` to never expire.
	
* *registration_id*

	string - The push notification ID/token that should be suppressed during SMS mode. If this is omitted, both SMS and push notifications will be delivered to the device.

**Responses**
```json
Status: 201 Created
```

***

## Disable SMS mode
Disables SMS mode

**Request**
```json
POST /users/sms_mode/delete
```

**Responses**
```json
Status: 200 OK
```
