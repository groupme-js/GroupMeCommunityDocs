# Members

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

## Add
Add members to a group.

Multiple members can be added in a single request, and results are fetched with a separate call (since memberships are processed asynchronously). The response includes a results_id that's used in the results request.

In order to correlate request params with resulting memberships, GUIDs can be added to the members parameters. These GUIDs will be reflected in the membership JSON objects.

**Request**
```
POST /groups/:group_id/members/add
{
  "members": [
    {
      "nickname": "Mom",
      "user_id": "1234567890",
      "guid": "GUID-1"
    },
    {
      "nickname": "Dad",
      "phone_number": "+1 2123001234",
      "guid": "GUID-2"
    },
    {
      "nickname": "Jane",
      "email": "jane@example.com",
      "guid": "GUID-3"
    }
  ]
}
```

**Parameters**
* *members*

	array - nickname is required. You must use one of the following identifiers: user_id, phone_number, or email. The array should contain objects with the following properties:
		
		* *nickname* (required)
		
			string - The name the user will use
			
		* *user_id*
			
			string - The user ID of the user to add
			
		* *phone_number*
			
			string - The phone number of the user to add
			
		* *email*
			
			string - The phone number of the user to add
			
		* *guid*
			
			string - If used, the GUID of the associated "results" object will match the value given
				
**Responses**
```
Status: 202 Accepted
{
  "results_id": "GUID"
}
```

***

## Results
Get the membership results from an add call.

Successfully created memberships will be returned, including any GUIDs that were sent up in the add request. If GUIDs were absent, they are filled in automatically. Failed memberships and invites are omitted.

Keep in mind that results are temporary -- they will only be available for 1 hour after the add request.

**Request**

`GET /groups/:group_id/members/results/:results_id`

**Parameters**

* *results_id* (required)

	string - This is the guid that's returned from an add request.
	
**Responses**

```
Status: 200 OK
{
  "members": [
    {
      "id": "1000",
      "user_id": "10000",
      "nickname": "John",
      "muted": false,
      "image_url": "https://i.groupme.com/AVATAR",
      "autokicked": false,
      "app_installed": true,
      "guid": "GUID-1"
    },
    {
      "id": "2000",
      "user_id": "20000",
      "nickname": "Anne",
      "muted": false,
      "image_url": "https://i.groupme.com/AVATAR",
      "autokicked": false,
      "app_installed": true,
      "guid": "GUID-2"
    }
  ]
}
```
```
Status: 503 Service Unavailable
Results aren't ready. Try again in a little bit.
```
```
Status: 404 Not Found
Results are no longer available. Don't try again.
```

***

## Remove

Remove a member (or yourself) from a group.

Note: The creator of the group cannot be removed or exit.

**Request**

`POST /groups/:group_id/members/:membership_id/remove`

**Parameters**

* *membership_id* (required)

	string - Please note that this isn't the same as the user ID. In the members key in the group JSON, this is the id value, not the user_id.
	
**Responses**

```
Status: 200 OK
```

***

## Update

Update your nickname in a group. The nickname must be between 1 and 50 characters.

**Request**
```
POST /groups/:group_id/memberships/update
{
  "membership": {
    "nickname": "NEW NICKNAME"
  }
}
```
**Responses**
```
Status: 200 OK
{
  "id": "MEMBERSHIP ID",
  "user_id": "USER ID",
  "nickname": "NEW NICKNAME",
  "muted": false,
  "image_url": "AVATAR URL",
  "autokicked": false,
  "app_installed": true
}
```