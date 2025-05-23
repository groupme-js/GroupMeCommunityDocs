# Public Directory

Unless otherwise stated, endpoints are relative to https://api.groupme.com/v3/ and must include the token of the user making the call - so, for example, if an endpoint is `GET /groups`, the request you make should be using the URL `https://api.groupme.com/v3/groups?token=aSDFghJkl`, where `aSDFghJkl` is replaced with the user's token.

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

## Preview Public Group

This call allows a client to check if a public or campus group requires a "join question" in order to apply for membership.

**Request**
```
GET /groups/:group_id/preview
```

**Response**
```
Status: 200 OK
{
  "id": "101646388",
  "theme_name": "wfh",
  "like_icon": {
    "type": "emoji",
    "pack_id": 1,
    "pack_index": 63
  },
  "updated_at": 1747666946,
  "requires_approval": true,
  "show_join_question": true,
  "join_question": {
    "type": "join_reason/questions/text",
    "text": "Why do you want to join our group?"
  },
  "children_count": 14
}
```

***

## Join Public Group

Allows you to join (or request to join) a public group without a share token.

**Request**
```
POST /groups/:group_id/join
{
  "answer": {
    "response": "Hi! This is why I'd like to join your group..."
  }
}
```

**Parameters**

* *response*

    String - The answer you'd like to give in response to the group's join question (if one is used, otherwise you can omit this parameter)

**Response**
```
Status: 201 Created
{
  "id": "1234567890",
  "name": "Family",
  "type": "private",
  "description": "Coolest Family Ever",
  "image_url": "https://i.groupme.com/123456789",
  "creator_user_id": "1234567890",
  "created_at": 1302623328,
  "updated_at": 1302623328,
  "members": [
    {
      "user_id": "1234567890",
      "nickname": "Jane",
      "muted": false,
      "image_url": "https://i.groupme.com/123456789"
    }
  ],
  "share_url": "https://groupme.com/join_group/1234567890/SHARE_TOKEN",
  "messages": {
    "count": 100,
    "last_message_id": "1234567890",
    "last_message_created_at": 1302623328,
    "preview": {
      "nickname": "Jane",
      "text": "Hello world",
      "image_url": "https://i.groupme.com/123456789",
      "attachments": [
        {
          "type": "image",
          "url": "https://i.groupme.com/123456789"
        },
        {
          "type": "location",
          "lat": "40.738206",
          "lng": "-73.993285",
          "name": "GroupMe HQ"
        },
        {
          "type": "emoji",
          "placeholder": "",
          "charmap": [
            [1, 42],
            [2, 34]
          ]
        }
      ]
    }
  }
}
```

***

## Search Public Groups

Returns a list of public groups based on search terms or lattitude/longitude coordinates. If a location is supplied, groups will be orderd roughly by distance from that point.

Returned groups will be split into 4 different lists, depending on where they were found. 
* `directories` if you're a member of a university campus directory and matching results were found in your school domain
* `popular` if they were found among the general list of public groups
* `trending` if they were found on the curated list of groups published by GroupMe,
* `nearby` if they were found in the automatically curated list of groups close to you.

> [!important]
> This request is relative to `https://api.groupme.com/v1/`, not `https://api.groupme.com/v3/`.

**Request**
```
GET https://api.groupme.com/v1/search
```

**Parameters**

* *per_page*

    Integer - Defines how many groups to return in the response. This value maxes out at 10,000 and defaults to 20 if omitted.

* *from*

    Integer - The offset index to begin returning results from in the paginated list of groups. For example, from=0 returns results starting at the beginning, from=20 skips the first 20 groups. Defaults to 0 if omitted.

* *query*

    String - A set of search terms to filter groups in the response.

* *lattitude*

    Decimal - The lattitude coordinate for a point used to sort groups by their distance.

* *longitude*

    Decimal - The longitude coordinate for a point used to sort groups by their distance.

**Response**
```
Status: 200 OK
{
  "directories": [
    {
      "id": "91086340",
      "name": "Group Memes",
      "description": "Memes",
      "avatar_url": "https://i.groupme.com/236x236.jpeg.93edc4af32944ad18f863be07d3a8069",
      "directory_id": "1928",
      "group_type": "closed",
      "max_members": 5000,
      "members_count": 16,
      "locations": [
        {
          "point": {
            "lat": 40.23512,
            "lon": -111.66219
          },
          "name": "Provo, Utah, United States",
          "full_address": "Provo, Utah, Utah, United States",
          "locality": "Provo",
          "country_region": "United States",
          "country_subdivision": "Utah",
          "country_code": "US"
        }
      ],
      "children_count": 0
    }
    ...
  ],
  "popular": [
    {
      "id": "101804807",
      "name": "Clean Memes",
      "description": "Clean memes is a clean gc and the people are (partially insane) great!",
      "avatar_url": "https://i.groupme.com/960x960.jpeg.2c7a7d23ddde418ba6b7c164bd195e3a",
      "directory_id": "",
      "group_type": "closed",
      "max_members": 5000,
      "members_count": 4261,
        "locations": [
          {
            "point": {
              "lat": 40.713047,
              "lon": -74.00723
            },
            "name": "New York, New York, United States",
            "full_address": "New York, New York, United States",
            "locality": "New York",
            "country_region": "United States",
            "country_subdivision": "New York",
            "country_code": "US"
          },
        ],
        "children_count": 18,
        "trending_allowed": true
      },
      ...
  ],
  "nearby": [ ... ],
  "trending": [ ... ],
  "location_name": "Salt Lake City, Utah United States"
}
```

***

## Index Trending

Returns a paginated list of the top 50 public groups, curated by GroupMe. 

> [!important]
> This request is relative to `https://api.groupme.com/v1/`, not `https://api.groupme.com/v3/`.

**Request**
```
GET https://api.groupme.com/v1/search/trending
```

**Parameters**

* *per_page*

    Integer - Defines how many groups to return in the response. This value maxes out at 10,000 and defaults to 20 if omitted.

* *from*

    Integer - The offset index to begin returning results from in the paginated list of groups. For example, from=0 returns results starting at the beginning, from=20 skips the first 20 groups. Defaults to 0 if omitted.

**Response**
```
Status: 200 OK
{
  "trending": [
    {
      "id": "98296943",
      "name": "Chilling",
      "description": "a place to chill 😁 make sure you read the rules!",
      "avatar_url": "https://i.groupme.com/626x626.jpeg.2be242e18c3e418c90d280e064100163",
      "directory_id": "",
      "group_type": "closed",
      "max_members": 5000,
      "members_count": 4832,
      "locations": [
        {
          "point": {
            "lat": 38.892062,
            "lon": -77.019912
          },
          "name": "United States",
          "full_address": "United States",
          "country_region": "United States",
          "country_code": "US"
        }
      ],
      "children_count": 10,
      "trending_allowed": true
    },
    {
      "id": "92309453",
      "name": "Memes",
      "description": "¯\\_(ツ)_/¯",
      "avatar_url": "https://i.groupme.com/917x923.jpeg.1cb8105bb7df41fbbea2a5c5bc78fd34",
      "directory_id": "",
      "group_type": "closed",
      "max_members": 10000,
      "members_count": 8789,
      "locations": [
        {
          "point": {
            "lat": 32.71576,
            "lon": -117.163817
           },
          "name": "San Diego, California, United States",
          "full_address": "San Diego, San Diego, California, United States",
          "locality": "San Diego",
          "country_region": "United States",
          "country_subdivision": "California",
          "country_code": "US"
        }
      ],
      "children_count": 8,
      "trending_allowed": true
    }
  ]
}
```

***

## Index Popular

Returns a paginated list of all public groups, ordered by member count (largest first).

> [!important]
> This request is relative to `https://api.groupme.com/v1/`, not `https://api.groupme.com/v3/`.

**Request**
```
GET https://api.groupme.com/v1/search/popular
```

**Parameters**

* *per_page*

    Integer - Defines how many groups to return in the response. This value maxes out at 10,000 and defaults to 20 if omitted.

* *from*

    Integer - The offset index to begin returning results from in the paginated list of groups. For example, from=0 returns results starting at the beginning, from=20 skips the first 20 groups. Defaults to 0 if omitted.

**Response**
```
Status: 200 OK
{
  "popular": [
    {
      "id": "92309453",
      "name": "Memes",
      "description": "¯\\_(ツ)_/¯",
      "avatar_url": "https://i.groupme.com/917x923.jpeg.1cb8105bb7df41fbbea2a5c5bc78fd34",
      "directory_id": "",
      "group_type": "closed",
      "max_members": 10000,
      "members_count": 8794,
      "locations": [
        {
          "point": {
            "lat": 32.71576,
            "lon": -117.163817
          },
          "name": "San Diego, California, United States",
          "full_address": "San Diego, San Diego, California, United States",
          "locality": "San Diego",
          "country_region": "United States",
          "country_subdivision": "California",
          "country_code": "US"
        },
      ],
      "children_count": 8,
      "trending_allowed": true
    },
    {
      "id": "16020539",
      "name": "ᏌᎪᏞᏴᎪNY ᏟᎻᎪᎢ 🎯🔥🐶📢",
      "description": "",
      "avatar_url": "https://i.groupme.com/1000x1000.jpeg.bf826152799f401f90045b64da690bb4",
      "directory_id": "",
      "group_type": "closed",
      "max_members": 8000,
      "members_count": 7608,
      "locations": [
        {
          "point": {
            "lat": 42.66709,
            "lon": -73.77516
          },
          "name": "Albany, New York, United States",
          "full_address": "Albany, Albany, New York, United States",
          "locality": "Albany",
          "country_region": "United States",
          "country_subdivision": "New York",
          "country_code": "US"
        }
      ],
      "children_count": 0
    }
    ...
  ]
}
```

***

# Campus Directories

> [!note]
> These calls are exclusive to users who are already members of [campus directories](https://groupme.com/campus). For simplicity, this documentation will not cover how to join a campus domain via the API, but it does discuss how to navigate and manage one once you're a member. 

## Index

List information about the campus directory you're a member of

**Request**
```
GET /directories
```

**Response**
```
{
  "id": 1928,
  "name": "Brigham Young University",
  "avatar_url": "",
  "type": "school_directory",
  "color": "#00458D",
  "short_name": "BYU",
  "members_count": 10380,
  "groups_count": 170,
  "share_url": "https://groupme.com/join_community/1928/6rRBO8DD",
  "share_qr_code_url": "https://image.groupme.com/qr/join_community/1928/6rRBO8DD/preview"
}
```

***

## Index Groups

Returns a paginated list of groups that are a part of the domain.

> [!important]
> This request is relative to `https://api.groupme.com/v1/`, not `https://api.groupme.com/v3/`.

**Request**
```
GET https://api.groupme.com/v1/search/directories
```

**Parameters**

* *per_page*

    Integer - Defines how many groups to return in the response. This value maxes out at 10,000 and defaults to 20 if omitted.

* *from*

    Integer - The offset index to begin returning results from in the paginated list of groups. For example, from=0 returns results starting at the beginning, from=20 skips the first 20 groups. Defaults to 0 if omitted.

**Response**
```
Status: 200 OK
{
  "directories": [
    {
      "id": "101838896",
      "name": "BYU Geology Club",
      "description": "New geoclub group chat!😊",
      "avatar_url": "https://i.groupme.com/1024x1024.jpeg.ec0495b9ac3f47b79f4ae279e1aeb4a5",
      "directory_id": "1928",
      "group_type": "private",
      "max_members": 5000,
      "members_count": 116,
      "children_count": 0
    },
    {
      "id": "104386559",
      "name": "BYU Wildlife and Range",
      "description": "🦅Wildlife and Range Student Association 🦌",
      "avatar_url": "https://i.groupme.com/1024x1024.jpeg.0d027c5a80934f22a2ac2e6204b9e563",
      "directory_id": "1928",
      "group_type": "private",
      "max_members": 5000,
      "members_count": 81,
      "children_count": 0
    }
    ...
  ]
}
```

## Index Members

Return a list containing all of the users who are visible to you within the campus directory. Note that the responses you get are also dependant on the privacy status of other users in the directory. Some people have their profiles set to be visible to only their major or graduation year, or hidden entirely.

> [!important]
> This request is relative to `https://api.groupme.com/v1/`, not `https://api.groupme.com/v3/`.

**Request**
```
GET https://api.groupme.com/v1/search/directory/users
```

**Parameters**

* *per_page*

    Integer - Defines how many groups to return in the response. This value maxes out at 10,000 and defaults to 20 if omitted.

* *from*

    Integer - The offset index to begin returning results from in the paginated list of groups. For example, from=0 returns results starting at the beginning, from=20 skips the first 20 groups. Defaults to 0 if omitted.
    
* *majors*

    Integer - A major code you'd like to filter by. The full dictionary of majors and their assigned codes can be found here: https://web.groupme.com/assets/majors/majors.en-US.json. You can include this parameter multiple times in one request to filter by multiple majors.

* *graduation_year*

    Integer - A graduation year you'd like to filter users by.

**Response**
```
{
  "users": [
    {
      "id": "105436130",
      "avatar_url": "https://i.groupme.com/1024x1024.jpeg.63a049689246446ca2685764191ce7c3",
      "name": "Mikey",
      "bio": "",
      "graduation_year": "",
      "majors": ["3702"],
      "social_media_links": [],
      "shared_group_ids": null,
      "created_at": "2022-08-24T17:52:38+0000",
      "photo_urls": null,
      "song_url": "",
      "interests": null
    },
    {
      "id": "93031586",
      "avatar_url": "https://i.groupme.com/1024x1024.jpeg.4a1dca36b02744b0bac8cfe85a2d0331",
      "name": "Spencer",
      "bio": "",
      "graduation_year": "2024",
      "majors": ["3702"],
      "social_media_links": [],
      "shared_group_ids": null,
      "created_at": "2021-05-04T17:25:12+0000",
      "photo_urls": null,
      "song_url": "",
      "interests": null
    },
    ...
  ]
}
```

***
