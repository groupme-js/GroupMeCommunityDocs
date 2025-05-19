# School Directories

For simplicity, this documentation will not cover how to join a campus domain via the API, but it does discuss how to navigate and manage one once you're a member. 

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





