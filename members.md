---
title: "Group Memberships"
description: "Learn how to interact with GroupMe's member objects via the API."
---

# Members

Unless otherwise stated, endpoints are relative to https://api.groupme.com/v3/ and must include the token of the user making the call - so, for example, if an endpoint is `GET /groups`, the request you make should be using the URL `https://api.groupme.com/v3/groups?token=aSDFghJkl`, where `aSDFghJkl` is replaced with the user's token.

URLs which include a variable, such as `GET /groups/:id`, have their variables marked with a colon. So a request to that endpoint would look like `https://api.groupme.com/v3/groups/1234567?token=aSDFghJkl`, where `1234567` is replaced with the group's ID, and `aSDFghJkl` is replaced with the user's token.

Finally, all responses are wrapped in a response envelope of the following form:

```json linenums="1"
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

## Index Members

Fetch a group's current or former member list.

This call is limited to admins and owners in the group. Any other caller will receive a `401 Unauthorized` response.

```json linenums="1" title="HTTP Request"
GET /groups/:group_id/members
```

**Parameters**

* *filter* (required)

	string - to fetch either `active` (current memberships) or `inactive` (former memberships).
	
```json linenums="1" title="HTTP Response"
Status: 200 OK
{
  "memberships":[
    {
      "id": "24681012",
      "user_id": "11223344",
      "name": "Alureon",
      "nickname": "Alu",
      "image_url": "https://i.groupme.com/1a3c5e7g",
      "state": "active",
      "roles": ["owner","admin"]
    },
    {
      "id": "1357911131",
      "user_id": "55667788",
      "name": "Franco H",
      "nickname": "Fran",
      "image_url": "https://i.groupme.com/2b4d6f8h",
      "state": "active",
      "roles": ["user"]
    }
  ]
}
```

## Add Members
Add members to a group.

Multiple members can be added in a single request, and results are fetched with a separate call (since memberships are processed asynchronously). The response includes a results_id that's used in the results request.

In order to correlate request params with resulting memberships, GUIDs can be added to the members parameters. These GUIDs will be reflected in the membership JSON objects.

```json linenums="1" title="HTTP Request"
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

	* *array* - nickname is required. You must use one of the following identifiers: user_id, phone_number, or email. The array should contain objects with the following properties:
		
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
				
```json linenums="1" title="HTTP Response"
Status: 202 Accepted
{
  "results_id": "GUID"
}
```

***

## Fetch "Add" Results
Get the membership results from an add call.

Successfully created memberships will be returned, including any GUIDs that were sent up in the add request. If GUIDs were absent, they are filled in automatically. Failed memberships and invites are omitted.

Keep in mind that results are temporary -- they will only be available for 1 hour after the add request.

```json linenums="1" title="HTTP Request"
GET /groups/:group_id/members/results/:results_id
```

**Parameters**

* *results_id* (required)

	string - This is the guid that's returned from an add request.
	
```json linenums="1" title="HTTP Response"
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
```json linenums="1" title="HTTP Response"
Status: 503 Service Unavailable
Results aren't ready. Try again in a little bit.
```
```json linenums="1" title="HTTP Response"
Status: 404 Not Found
Results are no longer available. Don't try again.
```

***

## Remove Member

Remove a member (or yourself) from a group.

Note: The creator of the group cannot be removed or exit.

```json linenums="1" title="HTTP Request"
POST /groups/:group_id/members/:membership_id/remove
```

**Parameters**

* *membership_id* (required)

	string - Please note that this isn't the same as the user ID. In the members key in the group JSON, this is the id value, not the user_id.
	
```json linenums="1" title="HTTP Response"
Status: 200 OK
```

***

## Index Pending Join Requests

Some groups have "Request to join" enabled, and thus require their applications approved by an admin. 

This request can be sent by any member of the group, not just admins. However, in order to approve or deny requests, you must have permission to manage the group.

```json linenums="1" title="HTTP Request"
GET /groups/:group_id/pending_memberships
```

```json linenums="1" title="HTTP Response"
Status: 200 OK
[
  {
    "id": "1075936468",
    "user_id": "43303468",
    "nickname": "bob",
    "image_url": "https://i.groupme.com/2320x3088.jpeg.df62e30722404d21acee182c1a3eb633",
    "reason": {
      "type": "join_reason/membership_join_reason",
      "question": {
        "type": "join_reason/questions/text",
        "text": "Why do you want to join this group?"
      },
      "answer": {
        "type": "join_reason/answers/text",
        "response": "Because it looks awesome!"
      },
      "method": "discoverable"
    },
    "timestamp": 1747219206,
    "state": "requested_pending"
  },
  {
    "id": "1075937258",
    "user_id": "43303469",
    "nickname": "allice",
    "image_url": "https://i.groupme.com/2320x3088.jpeg.df62e307b2402321acee182c1a3eb633",
    "reason": {
      "type": "join_reason/membership_join_reason",
      "question": {
        "type": "join_reason/questions/text",
        "text": "Why do you want to join this group?"
      },
      "answer": {
        "type": "join_reason/answers/text",
        "response": "Because I love GroupMe!"
      },
      "method": "discoverable"
    },
    "timestamp": 1756219206,
    "state": "requested_pending"
  }
]
```

***

## Accept/Deny a Pending Join Request

This request is exclusive to members with permission to manage the group, non Admin/Owners will receive a 401: Unauthorized response.

```json linenums="1" title="HTTP Request"
POST /groups/:group_id/members/:membership_id/approval
{
  "approval": true
}
```
**Parameters**

* *membership_id* (required)

	string - The *group specific* ID of the membership you wish to handle. Please note that this isn't the same as the user ID. In the members key in the group JSON, this is the id value, not the user_id.

* *approval* (required)

	boolean - `true` to approve, `false` to deny.

Note: if you deny the membership, `state` will be "denied" instead of "active"

```json linenums="1" title="HTTP Response"
Status: 200 OK
{
  "membership_id": 1075929653,
  "state": "active"
}
```
```json linenums="1" title="HTTP Response"
Status: 401 Unauthorized
You are neither the Owner nor an Admin in this group
```

***

## Ban Member (v2)

Prevent a member from rejoining a group after they leave.

Current members of the group cannot be banned from rejoining as they have not left.

Note: This request is relative to `https://v2.groupme.com`, NOT `https://api.groupme.com/v3`.

```json linenums="1" title="HTTP Request"
POST /groups/:group_id/memberships/:membership_id/destroy
```

**Parameters**

* *membership_id* (required)

	string - Please note that this isn't the same as the user ID. In the members key in the group JSON, this is the id value, not the user_id.
	
```json linenums="1" title="HTTP Response"
Status: 200 OK
```

***

## Change nickname

Update your nickname in a group. The nickname must be between 1 and 50 characters.

```json linenums="1" title="HTTP Request"
POST /groups/:group_id/memberships/update
{
  "membership": {
    "nickname": "NEW NICKNAME"
  }
}
```

```json linenums="1" title="HTTP Response"
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
