# Account Management

All endpoints are relative to https://api.groupme.com/v3/ and must include the token of the user making the call - so, for example, if an endpoint is `GET /groups`, the request you make should be using the URL `https://api.groupme.com/v3/groups?token=aSDFghJkl`, where `aSDFghJkl` is replaced with the user's token.

URLs which include a variable, such as `GET /groups/:id`, have their variables marked with a colon. So a request to that endpoint would look like `https://api.groupme.com/v3/groups/1234567?token=aSDFghJkl`, where `1234567` is replaced with the group's ID, and `aSDFghJkl` is replaced with the user's token.

Finally, all responses are wrapped in a response envelope of the following form:

```
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

`GET /users/me`

**Responses**
```
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
```
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

	string — URL to valid JPG/PNG/GIF image. URL will be converted into an image service link (https://i.groupme.com/....)
	
* *name*

	string — Name must be of the form FirstName LastName
	
* *email*

	string — Email address. Must be in name@domain.com form.
	
* *zip_code*

	string — Zip code.
	
**Responses**
```
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

## Enable SMS mode

Enables SMS mode for N hours, where N is at most 48. After N hours have elapsed, user will receive push notfications.

**Request**
```
POST /users/sms_mode
{
  "duration": 4,
  "registration_id": "TOKEN"
}
```

**Parameters**
* *duration* (required)

	integer - the number of hours to be in SMS mode for. Max of 48.
	
* *registration_id*

	string — The push notification ID/token that should be suppressed during SMS mode. If this is omitted, both SMS and push notifications will be delivered to the device.

**Responses**
```
Status: 201 Created
```

***

## Disable SMS mode
Disables SMS mode

**Request**

`POST /users/sms_mode/delete`

**Responses**
```
Status: 200 OK
```