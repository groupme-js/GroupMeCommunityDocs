---
title: "Calandar Events"
description: "Learn how to interact with GroupMe's Calandar Events via the API."
---

# Calendar Events

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

## Index events

List all the upcoming events for the group

**Request**
```json
GET /conversations/:group_id/events/list?end_at=2021-07-12T02:52:50Z&limit=20
```

**Parameters**

* *end_at* (required)

	string - an ISO 8601-formatted string which represents the date before which no events will be listed. IMO it makes more sense to call this "start_at", but that's none of my business.

* *limit* (required)

	integer - the number of results to pull. GroupMe's default is 20, not sure what the limit is.

**Responses**

```json
Status: 200 OK
{
  "events": [
    {
      "name": "Test",
      "start_at": "2021-07-13T00:00:00-05:00",
      "end_at": "2021-07-15T00:00:00-05:00",
      "is_all_day": false,
      "timezone": "America/Chicago",
      "reminders": [100, 2],
      "conversation_id": "12321",
      "event_id": "1231231231212123123",
      "creator_id": "23112312",
      "going": [
        "432"
      ],
      "not_going": [],
      "created_at": "2021-07-12T02:52:50Z",
      "updated_at": "2021-07-12T02:52:50Z"
    },
    {
      "name": "Test 2",
      "start_at": "2021-07-14T20:45:00-05:00",
      "end_at": "2021-07-15T21:00:00-05:00",
      "is_all_day": false,
      "timezone": "America/Chicago",
      "reminders": [],
      "conversation_id": "1231231322312",
      "event_id": "1231231231322",
      "creator_id": "1112312",
      "going": [
        "5463",
        "112344"
      ],
      "not_going": [],
      "created_at": "2021-07-12T01:41:51Z",
      "updated_at": "2021-07-12T02:35:16Z"
    }
  ]
}
```

***

## Show a Specific Event

List details on a specific event given its ID

**Request**
```json
GET /conversations/:group_id/events/show?event_id=<event_id>
```

**Parameters**

* *event_id*

    String - The ID of the event you want to fetch

**Response**
```json
Status: 200 OK
{
  "event": {
    "name": "Event Name",
    "description": "Event Description",
    "image_url": "https://i.groupme.com/1024x1024.png.8560aca484bf41f4863e2abec6016e07",
    "location": {
      "lat": 38.88949419381217,
      "lng": -77.0352490246296,
      "name": "Washington Monument",
      "address": "2 15th St NW (btwn Constitution Ave NW & Independence Ave SW) \nWashington, D.C. 20560 \nUnited States"
    },
    "start_at": "2021-08-30T01:00:00-04:00",
    "end_at": "2021-08-30T01:15:00-04:00",
    "is_all_day": false,
    "timezone": "America/New_York",
    "reminders": [0, 604800],
    "conversation_id": "70077952",
    "event_id": "0f15691677e444ceb64118bf39d41ec8",
    "creator_id": "74938777",
    "going": [
      "74938777"
    ],
    "not_going": [],
    "created_at": "2021-08-30T05:01:50Z",
    "updated_at": "2021-08-30T05:01:50Z"
  }
}
```

***

## Create an event

Creates a calendar event.

**Request**

```json
POST /conversations/:id/events/create
{
  "name": "Dasani Appreciation Day",
  "start_at": "2021-07-11T20:45:00-05:00",
  "end_at": "2021-07-12T20:45:00-05:00",
  "timezone": "America/Chicago",
  "description": "A day for us all to appreciate the wondrous water that is Dasani",
  "is_all_day": false,
  "image_url": "https://i.groupme.com/1051x816.jpeg.b6e08c195b35453c813843295a61b1a4",
  "location": {
	"address": "Kalkofnsvegur 2 101, 101 Reykjavík, Iceland",
	"name": "Heaven?",
	"lat": "64.148430",
	"lng": "-21.9355508"
  },
  "reminders": [0, 300]
}
```

**Parameters**

* *name* (required)

	string - The name of the event.

* *start_at* (required)

	string - A datetime in ISO 8601 format. Represents the date and time that the event starts.

* *end_at* (required)

	string - A datetime in ISO 8601 format. Represents the date and time that the event ends.
	
* *timezone* (required)

	string - An indication of what timezone the event takes place in. Seems to be based on the [TZ Database](https://www.iana.org/time-zones) names.

* *description*

	string - The text you want to use to describe the event.

* *is_all_day*

	boolean - If true, will not specify a time for clients.
	
* *image_url*

	string - An image URL which will be attached to the event if provided. This image MUST be uploaded to GroupMe's [Image Service](images.md) first.

* *location*

	object - Can contain address, name (required), lat, and lng fields. Address and name are both strings, while lat and lng must be numbers expressed as strings (as shown in the example) which represent the latitude and longitude, respectively, of the location.
	
* *reminders*

	array - An array of integers, which represent automatic reminders from GroupMe. The number is the number of seconds between the reminder and the start of the event - for example, if one of the numbers is 300, that represents sending a reminder 5 minutes before the event starts. Only two reminders are permitted, and only certain values are permitted: 0, 300, 900, 1800, 3600, 7200, 86400, 172800, and 604800.

**Responses**
```json
Status: 201 Created
{
  "event": {
    "name": "Dasani Appreciation Day",
    "start_at": "2021-07-11T20:45:00-05:00",
    "end_at": "2021-07-12T20:45:00-05:00",
    "timezone": "America/Chicago",
    "description": "A day for us all to appreciate the wondrous water that is Dasani",
    "is_all_day": false,
    "image_url": "https://i.groupme.com/1051x816.jpeg.b6e08c195b35453c813843295a61b1a4",
    "location": {
      "address": "Kalkofnsvegur 2 101, 101 Reykjavík, Iceland",
      "name": "Heaven?",
      "lat": "64.148430",
      "lng": "-21.9355508"
    },
    "reminders": [0, 300],
    "conversation_id": "14538582",
    "event_id": "dfgdfghs45q45z4eeease45",
    "creator_id": "12312",
    "going": [
      "12312312312"
    ],
    "not_going": [],
    "created_at": "2021-07-12T02:52:50Z",
    "updated_at": "2021-07-12T02:52:50Z"
  },
  "message": {
    "attachments": [
      {
        "event_id": "123123123123123",
        "type": "event",
        "view": "full"
      }
    ],
    "avatar_url": "https://i.groupme.com/1100x1148.jpeg.705e8e84384c4249bb956f230e43d67d",
    "created_at": 1626058370,
    "event": {
      "data": {
        "event": {
          "id": "123123123123",
          "name": "Test"
        },
        "url": "https://s.groupme.com/1wcGxvER",
        "user": {
          "id": "123131231",
          "nickname": "Dasaniel Royer"
        }
      },
      "type": "calendar.event.created"
    },
    "favorited_by": [],
    "group_id": "12312312312312",
    "id": "21312312312",
    "name": "Dasaniel Royer",
    "sender_id": "123123123123123",
    "sender_type": "user",
    "source_guid": "dsfasdfgsfghukjfgdd",
    "system": false,
    "text": "Dasaniel Royer created event 'Dasani Appreciation Day' https://s.groupme.com/123123121",
    "user_id": "12312311"
  }
}
```

***

## Edit/Update an event

Edit or update an event. In order to do this, you must be the original creator of the event. Note that this is very similar to the Create request. You only need to provide whatever parameters you wish to change about the original event, but start_at, end_at, timezone, and is_all_day MUST be provided together if any of them are included!

**Request**

```json
POST /conversations/:group_id/events/update?event_id=1123123
{
  "name": "Dasani Appreciation Day",
  "start_at": "2021-07-11T20:45:00-05:00",
  "end_at": "2021-07-12T20:45:00-05:00",
  "timezone": "America/Chicago",
  "description": "A day for us all to appreciate the wondrous water that is Dasani",
  "is_all_day": false,
  "image_url": "https://i.groupme.com/1051x816.jpeg.b6e08c195b35453c813843295a61b1a4",
  "location": {
	"address": "Kalkofnsvegur 2 101, 101 Reykjavík, Iceland",
	"name": "Heaven?",
	"lat": "64.148430",
	"lng": "-21.9355508"
  },
  "reminders": [0, 300]
}
```

**Parameters**

* *event_id* (required)

	string - the ID of the event to edit. Please note that this is supplied as part of the URL query string, rather than part of the request body.

* *name*

	string - The name of the event.

* *start_at*

	string - A datetime in ISO 8601 format. Represents the date and time that the event starts. If this is included, you MUST also include end_at, timezone, and is_all_day!

* *end_at*

	string - A datetime in ISO 8601 format. Represents the date and time that the event ends. If this is included, you MUST also include start_at, timezone, and is_all_day!
	
* *timezone*

	string - An indication of what timezone the event takes place in. Seems to be based on the [TZ Database](https://www.iana.org/time-zones) names. If this is included, you MUST also include end_at, start_at, and is_all_day!

* *description*

	string - The text you want to use to describe the event.

* *is_all_day*

	boolean - If true, will not specify a time for clients. If this is included, you MUST also include end_at, timezone, and start_at!
	
* *image_url*

	string - An image URL which will be attached to the event if provided. This image MUST be processed by GroupMe's [Image Service](images.md) before it can be used.

* *location*

	object - Can contain address, name (required), lat, and lng fields. Address and name are both strings, while lat and lng must be numbers expressed as strings (as shown in the example).
	
* *reminders*

	array - An array of integers, which represent automatic reminders from GroupMe. The number is the number of seconds between the reminder and the start of the event - for example, if one of the numbers is 300, that represents sending a reminder 5 minutes before the event starts. Only two reminders are permitted, and only certain values are permitted: 0, 300, 900, 1800, 3600, 7200, 86400, 172800, and 604800.


**Responses**

```json
Status: 200 OK
{
	"event": {
		... //Refer to Index or Create for information on the Event object
	}
}
```

***

## Delete/Cancel an event

Cancel an upcoming event. In order to do this, you much be the creator of the event.

**Request**
```json
DELETE /conversations/:group_id/events/delete?event_id=12312312
```

**Parameters**

* *event_id* (required)

	string - The ID of the event to delete.

**Responses**

```json
Status: 200 OK
```

***

## Mark going/not going

Marks you as going or not going to an event.

**Request**

```json
POST /conversations/:group_id/events/rsvp?event_id=123123123123&going=true
```

**Parameters**

* *event_id* (required)

	string - The ID of the event to respond to.

* *going* (required)

	boolean - If true, this request will mark you as going. If false, this request will mark you as not going.

**Responses**

```json
Status: 200 OK
{
	"event": {
		... //Refer to Index or Create for details on this object.
	}
}
```

***

## Un-mark going/not going

Marks the user as neither going nor not going; in other words, marks the user as "unsure" or "pending".

**Request**

```json
DELETE /conversations/:group_id/events/rsvp/delete?event_id=123123
```

**Parameters**

* *event_id* (required)

	string - the ID of the event you're responding to

**Responses**

```json
Status: 200 OK
{
	"event": {
		... //Refer to Index or Create for details on this object.
	}
}
```
