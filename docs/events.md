---
title: "Message Events"
description: "Documentation for the various event types that can be present in GroupMe messages."
---

# Message Events

GroupMe messages can contain an `event` object, which describes system-generated occurrences or specific actions within a group, subgroup (topic), or DM. These events provide structured data about changes like members being added, polls being created, calendar events being updated, messages being pinned, and more. Messages containing events often have `system: true` or a `sender_type` of "system" or "service".

This document lists the different `event.type` values observed, along with the structure of their corresponding `event` object.

> [!WARNING]
> **API Inconsistency: User ID Data Types**
> Developers should be aware that within the `event.data` objects detailed below, user IDs (such as `user.id`, `member.id`, `pinned_by`, etc.) are sometimes represented as **numbers** and other times as **strings**. This is inconsistent with the general GroupMe API practice where user IDs are typically strings. These types may be patched at any time. **This highlights the critical need to handle both types robustly in your code.**

***

## Membership Events

Events related to group membership changes (users joining, leaving, etc.). These apply to main groups.

### **`membership.announce.added`**

Indicates that one or more users have been added to the group by an existing member.

```json linenums="1" title="Event Object Structure"
{
  "type": "membership.announce.added",
  "data": {
    "added_users": [
      {
        "id": 131245991,
        "nickname": "Sprocket"
      }
    ],
    "adder_user": {
      "id": 93645911,
      "nickname": "bill"
    }
  }
}
```

*   *type*

    string - Must be `membership.announce.added`.

*   *data* (object) - Contains details of the added members.

    *   *added_users* (array of objects) - A list of users who were added. Each object contains:

        *   *id*

            number - The ID of the added user (e.g., `131245991`). (See warning about User ID types).

        *   *nickname*

            string - The nickname of the added user.

    *   *adder_user* (object) - Information about the user who added the new member(s).

        *   *id*

            number - The ID of the user who added the new member(s) (e.g., `93645911`). (See warning about User ID types).

        *   *nickname*

            string - The nickname of the user who added the new member(s).

***

### **`membership.announce.joined`**

Indicates that a user has joined the group (e.g., via a share link or if the group is open).

> [!NOTE]
> This event typically fires in groups that either have "Request to Join" enabled or in smaller groups (generally with fewer than ~200 members). In very large, open groups, individual join events might not always be generated.

```json linenums="1" title="Event Object Structure"
{
  "type": "membership.announce.joined",
  "data": {
    "user": {
      "id": 131245991,
      "nickname": "Sprocket"
    }
  }
}
```

*   *type*

    string - Must be `membership.announce.joined`.

*   *data* (object) - Contains details of the user who joined.

    *   *user* (object) - Information about the user who joined.

        *   *id*

            number - The ID of the user who joined (e.g., `131245991`). (See warning about User ID types).

        *   *nickname*

            string - The nickname of the user who joined.

***

### **`membership.announce.rejoined`**

Indicates that a user has rejoined the group.

```json linenums="1" title="Event Object Structure"
{
  "type": "membership.announce.rejoined",
  "data": {
    "user": {
      "id": 131245991,
      "nickname": "Sprocket"
    }
  }
}
```

*   *type*

    string - Must be `membership.announce.rejoined`.

*   *data* (object) - Contains details of the user who rejoined.

    *   *user* (object) - Information about the user who rejoined.

        *   *id*

            number - The ID of the user who rejoined (e.g., `131245991`). (See warning about User ID types).

        *   *nickname*

            string - The nickname of the user who rejoined.

***

### **`membership.notifications.exited`**

Indicates that a user has left the group themselves.

```json linenums="1" title="Event Object Structure"
{
  "type": "membership.notifications.exited",
  "data": {
    "removed_user": {
      "id": 131245991,
      "nickname": "Sprocket"
    }
  }
}
```

*   *type*

    string - Must be `membership.notifications.exited`.

*   *data* (object) - Contains details of the user who exited.

    *   *removed_user* (object) - Information about the user who exited the group.

        *   *id*

            number - The ID of the user who exited (e.g., `131245991`). (See warning about User ID types).

        *   *nickname*

            string - The nickname of the user who exited.

***

### **`membership.notifications.removed`**

Indicates that a user has been removed from the group by another member.

```json linenums="1" title="Event Object Structure"
{
  "type": "membership.notifications.removed",
  "data": {
    "remover_user": {
      "id": 93645911,
      "nickname": "bill"
    },
    "removed_user": {
      "id": 131245991,
      "nickname": "Sprocket"
    }
  }
}
```

*   *type*

    string - Must be `membership.notifications.removed`.

*   *data* (object) - Contains details of the removed member.

    *   *remover_user* (object) - Information about the user who performed the removal.

        *   *id*

            number - The ID of the user who performed the removal (e.g., `93645911`). (See warning about User ID types).

        *   *nickname*

            string - The nickname of the user who performed the removal.

    *   *removed_user* (object) - Information about the user who was removed.

        *   *id*

            number - The ID of the user who was removed (e.g., `131245991`). (See warning about User ID types).

        *   *nickname*

            string - The nickname of the user who was removed.

***

## Group Management Events

Events related to changes in main group settings and properties.

### **`group.avatar_change`**

Indicates that the group's avatar has been changed.

```json linenums="1" title="Event Object Structure"
{
  "type": "group.avatar_change",
  "data": {
    "user": {
      "id": 93645911,
      "nickname": "Isaac"
    },
    "avatar_url": "https://i.groupme.com/1024x1536.jpeg.fb916ff109cd498dad1fc67978d51fff"
  }
}
```

*   *type*

    string - Must be `group.avatar_change`.

*   *data* (object) - Contains details of the avatar change.

    *   *user* (object) - Information about the user who changed the avatar.

        *   *id*

            number - The ID of the user who changed the avatar (e.g., `93645911`). (See warning about User ID types).

        *   *nickname*

            string - The nickname of the user who changed the avatar.

    *   *avatar_url*

        string - The URL of the new group avatar.

***

### **`group.like_icon_removed`**

Indicates that the group's custom like icon has been removed, reverting to the default.

```json linenums="1" title="Event Object Structure"
{
  "type": "group.like_icon_removed",
  "data": {
    "user": {
      "id": 93645911,
      "nickname": "Isaac"
    }
  }
}
```

*   *type*

    string - Must be `group.like_icon_removed`.

*   *data* (object) - Contains details of the like icon removal.

    *   *user* (object) - Information about the user who removed the custom like icon.

        *   *id*

            number - The ID of the user who removed the custom like icon (e.g., `93645911`). (See warning about User ID types).

        *   *nickname*

            string - The nickname of the user who removed the custom like icon.

***

### **`group.like_icon_set`**

Indicates that a custom like icon has been set for the group.

```json linenums="1" title="Event Object Structure"
{
  "type": "group.like_icon_set",
  "data": {
    "user": {
      "id": 93645911,
      "nickname": "Isaac"
    },
    "like_icon": {
      "pack_id": 1,
      "pack_index": 1,
      "type": "emoji"
    }
  }
}
```

*   *type*

    string - Must be `group.like_icon_set`.

*   *data* (object) - Contains details of the new like icon.

    *   *user* (object) - Information about the user who set the like icon.

        *   *id*

            number - The ID of the user who set the like icon (e.g., `93645911`). (See warning about User ID types).

        *   *nickname*

            string - The nickname of the user who set the like icon.

    *   *like_icon* (object) - Details of the custom like icon.

        *   *pack_id*

            number - The ID of the emoji pack.

        *   *pack_index*

            number - The index of the emoji within the pack.

        *   *type*

            string - The type of like icon (e.g., "emoji").

***

### **`group.name_change`**

Indicates that the group's name has been changed.

```json linenums="1" title="Event Object Structure"
{
  "type": "group.name_change",
  "data": {
    "user": {
      "id": 93645911,
      "nickname": "Isaac"
    },
    "name": "blah"
  }
}
```

*   *type*

    string - Must be `group.name_change`.

*   *data* (object) - Contains details of the name change.

    *   *user* (object) - Information about the user who changed the group name.

        *   *id*

            number - The ID of the user who changed the group name (e.g., `93645911`). (See warning about User ID types).

        *   *nickname*

            string - The nickname of the user who changed the group name.

    *   *name*

        string - The new name of the group.

***

### **`group.owner_changed`**

Indicates that the ownership of the group has been transferred.

```json linenums="1" title="Event Object Structure"
{
  "type": "group.owner_changed",
  "data": {
    "old_owner": {
      "id": 131245991,
      "nickname": "Sprocket"
    },
    "new_owner": {
      "id": 93645911,
      "nickname": "Isaac"
    }
  }
}
```

*   *type*

    string - Must be `group.owner_changed`.

*   *data* (object) - Contains details of the ownership change.

    *   *old_owner* (object) - Information about the previous owner.

        *   *id*

            number - The ID of the previous owner (e.g., `131245991`). (See warning about User ID types).

        *   *nickname*

            string - The nickname of the previous owner.

    *   *new_owner* (object) - Information about the new owner.

        *   *id*

            number - The ID of the new owner (e.g., `93645911`). (See warning about User ID types).

        *   *nickname*

            string - The nickname of the new owner.

***

### **`group.requires_approval_disabled`**

Indicates that the "join requires approval" setting has been disabled for the group.

```json linenums="1" title="Event Object Structure"
{
  "type": "group.requires_approval_disabled",
  "data": {
    "user": {
      "id": 93645911,
      "nickname": "Isaac"
    }
  }
}
```

*   *type*

    string - Must be `group.requires_approval_disabled`.

*   *data* (object) - Contains details of the setting change.

    *   *user* (object) - Information about the user who changed the setting.

        *   *id*

            number - The ID of the user who changed the setting (e.g., `93645911`). (See warning about User ID types).

        *   *nickname*

            string - The nickname of the user who changed the setting.

***

### **`group.requires_approval_enabled`**

Indicates that the "join requires approval" setting has been enabled for the group.

```json linenums="1" title="Event Object Structure"
{
  "type": "group.requires_approval_enabled",
  "data": {
    "user": {
      "id": 93645911,
      "nickname": "Isaac"
    }
  }
}
```

*   *type*

    string - Must be `group.requires_approval_enabled`.

*   *data* (object) - Contains details of the setting change.

    *   *user* (object) - Information about the user who changed the setting.

        *   *id*

            number - The ID of the user who changed the setting (e.g., `93645911`). (See warning about User ID types).

        *   *nickname*

            string - The nickname of the user who changed the setting.

***

### **`group.role_change_admin`**

Indicates that a member's role has been changed regarding admin status.

```json linenums="1" title="Event Object Structure"
{
  "type": "group.role_change_admin",
  "data": {
    "user": {
      "id": 93645911,
      "nickname": "bill"
    },
    "role": "admin",
    "member": {
      "id": 131245991,
      "nickname": "Sprocket"
    }
  }
}
```

*   *type*

    string - Must be `group.role_change_admin`.

*   *data* (object) - Contains details of the role change.

    *   *user* (object) - Information about the user who performed the role change.

        *   *id*

            number - The ID of the user who performed the role change (e.g., `93645911`). (See warning about User ID types).

        *   *nickname*

            string - The nickname of the user who performed the role change.

    *   *role*

        string - The new role assigned (e.g., "admin").

    *   *member* (object) - Information about the member whose role was changed.

        *   *id*

            number - The ID of the member whose role was changed (e.g., `131245991`). (See warning about User ID types).

        *   *nickname*

            string - The nickname of the member whose role was changed.

***

### **`group.shared`**

Indicates that group sharing (join link) has been enabled.

```json linenums="1" title="Event Object Structure"
{
  "type": "group.shared",
  "data": {
    "user": {
      "id": 93645911,
      "nickname": "Isaac"
    },
    "share_url": "https://groupme.com/join_group/108126494/1Os5CrBg",
    "share_qr_code_url": "https://image.groupme.com/qr/join_group/108126494/1Os5CrBg/preview"
  }
}
```

*   *type*

    string - Must be `group.shared`.

*   *data* (object) - Contains details of the group sharing enablement.

    *   *user* (object) - Information about the user who enabled sharing.

        *   *id*

            number - The ID of the user who enabled sharing (e.g., `93645911`). (See warning about User ID types).

        *   *nickname*

            string - The nickname of the user who enabled sharing.

    *   *share_url*

        string - The URL to join the group.

    *   *share_qr_code_url*

        string - The URL for the QR code image to join the group.

***

### **`group.subgroup_created`**

Indicates that a new topic (subgroup/channel) has been created within the group.

```json linenums="1" title="Event Object Structure"
{
  "type": "group.subgroup_created",
  "data": {
    "user": {
      "id": 93645911,
      "nickname": "bill"
    },
    "subgroup_topic": "test topic",
    "subgroup_avatar_url": null,
    "subgroup_id": 108126678
  }
}
```

*   *type*

    string - Must be `group.subgroup_created`.

*   *data* (object) - Contains details of the created subgroup.

    *   *user* (object) - Information about the user who created the topic.

        *   *id*

            number - The ID of the user who created the topic (e.g., `93645911`). (See warning about User ID types).

        *   *nickname*

            string - The nickname of the user who created the topic.

    *   *subgroup_topic*

        string - The name/topic of the created subgroup.

    *   *subgroup_avatar_url*

        string or null - The URL of the avatar for the subgroup, if any.

    *   *subgroup_id*

        number - The ID of the newly created subgroup.

***

### **`group.subgroup_removed`**

Indicates that a topic (subgroup/channel) has been removed from the group.

```json linenums="1" title="Event Object Structure"
{
  "type": "group.subgroup_removed",
  "data": {
    "user": {
      "id": 93645911,
      "nickname": "bill"
    },
    "subgroup_topic": "new topic",
    "subgroup_id": 108126567
  }
}
```

*   *type*

    string - Must be `group.subgroup_removed`.

*   *data* (object) - Contains details of the removed subgroup.

    *   *user* (object) - Information about the user who removed the topic.

        *   *id*

            number - The ID of the user who removed the topic (e.g., `93645911`). (See warning about User ID types).

        *   *nickname*

            string - The nickname of the user who removed the topic.

    *   *subgroup_topic*

        string - The name/topic of the removed subgroup.

    *   *subgroup_id*

        number - The ID of the removed subgroup.

***

### **`group.theme_change`**

Indicates that the group's chat theme has been changed.

```json linenums="1" title="Event Object Structure"
{
  "type": "group.theme_change",
  "data": {
    "user": {
      "id": 93645911,
      "nickname": "Isaac"
    },
    "theme_name": "ideas"
  }
}
```

*   *type*

    string - Must be `group.theme_change`.

*   *data* (object) - Contains details of the theme change.

    *   *user* (object) - Information about the user who changed the theme.

        *   *id*

            number - The ID of the user who changed the theme (e.g., `93645911`). (See warning about User ID types).

        *   *nickname*

            string - The nickname of the user who changed the theme.

    *   *theme_name*

        string - The name of the new theme (e.g., "ideas", "default", "stars").

***

### **`group.topic_change`**

Indicates that the group's description (often referred to as "topic" in settings) has been changed.

```json linenums="1" title="Event Object Structure"
{
  "type": "group.topic_change",
  "data": {
    "user": {
      "id": 93645911,
      "nickname": "Isaac"
    },
    "topic": "blah"
  }
}
```

*   *type*

    string - Must be `group.topic_change`.

*   *data* (object) - Contains details of the description change.

    *   *user* (object) - Information about the user who changed the group description.

        *   *id*

            number - The ID of the user who changed the group description (e.g., `93645911`). (See warning about User ID types).

        *   *nickname*

            string - The nickname of the user who changed the group description.

    *   *topic*

        string - The new description of the group.

***

### **`group.type_change`**

Indicates that the group's type (e.g., private, closed, announcement) has been changed.

```json linenums="1" title="Event Object Structure"
{
  "type": "group.type_change",
  "data": {
    "user": {
      "id": 93645911,
      "nickname": "Isaac"
    },
    "type": "closed",
    "message_edit_period": 15
  }
}
```

*   *type*

    string - Must be `group.type_change`.

*   *data* (object) - Contains details of the type change.

    *   *user* (object) - Information about the user who changed the group type.

        *   *id*

            number - The ID of the user who changed the group type (e.g., `93645911`). (See warning about User ID types).

        *   *nickname*

            string - The nickname of the user who changed the group type.

    *   *type*

        string - The new type of the group. Observed values include:
        *   `"closed"`: Members can be added by other members.
        *   `"private"`: Only admins can add new members. (Note: API text might sometimes say "open" for this type).
        *   `"announcement"`: Only admins can send messages.

    *   *message_edit_period*

        number (optional, may not be present in all contexts, e.g., WebSocket events) - The time window (in minutes or a similar unit, contextually) during which messages can be edited. This value can change based on the group type (e.g., `15` for closed/private, `43200` for announcement, or `null`/absent).

***

### **`group.unshared`**

Indicates that group sharing (join link) has been disabled.

```json linenums="1" title="Event Object Structure"
{
  "type": "group.unshared",
  "data": {
    "user": {
      "id": 93645911,
      "nickname": "Isaac"
    }
  }
}
```

*   *type*

    string - Must be `group.unshared`.

*   *data* (object) - Contains details of the group sharing disablement.

    *   *user* (object) - Information about the user who disabled sharing.

        *   *id*

            number - The ID of the user who disabled sharing (e.g., `93645911`). (See warning about User ID types).

        *   *nickname*

            string - The nickname of the user who disabled sharing.

***

### **`group.visibility_set.community`**

Indicates the group's visibility has been set to a specific community (e.g., a campus).

```json linenums="1" title="Event Object Structure"
{
  "type": "group.visibility_set.community",
  "data": {
    "user": {
      "id": 93645911,
      "nickname": "Isaac"
    }
  }
}
```

*   *type*

    string - Must be `group.visibility_set.community`.

*   *data* (object) - Contains details of the visibility change.

    *   *user* (object) - Information about the user who changed the visibility.

        *   *id*

            number - The ID of the user who changed the visibility (e.g., `93645911`). (See warning about User ID types).

        *   *nickname*

            string - The nickname of the user who changed the visibility.
        *(Note: The specific community information is usually part of the message text rather than the event data).*

***

### **`group.visibility_set.hidden`**

Indicates the group has been made hidden and is not discoverable.

```json linenums="1" title="Event Object Structure"
{
  "type": "group.visibility_set.hidden",
  "data": {
    "user": {
      "id": 93645911,
      "nickname": "Isaac"
    }
  }
}
```

*   *type*

    string - Must be `group.visibility_set.hidden`.

*   *data* (object) - Contains details of the visibility change.

    *   *user* (object) - Information about the user who changed the visibility.

        *   *id*

            number - The ID of the user who changed the visibility (e.g., `93645911`). (See warning about User ID types).

        *   *nickname*

            string - The nickname of the user who changed the visibility.

***

### **`group.visibility_set.searchable`**

Indicates the group has been made visible and can be found in Discover.

```json linenums="1" title="Event Object Structure"
{
  "type": "group.visibility_set.searchable",
  "data": {
    "user": {
      "id": 93645911,
      "nickname": "Isaac"
    }
  }
}
```

*   *type*

    string - Must be `group.visibility_set.searchable`.

*   *data* (object) - Contains details of the visibility change.

    *   *user* (object) - Information about the user who changed the visibility.

        *   *id*

            number - The ID of the user who changed the visibility (e.g., `93645911`). (See warning about User ID types).

        *   *nickname*

            string - The nickname of the user who changed the visibility.

***

## Subgroup/Topic Management Events

Events related to changes in subgroup (topic/channel) settings and properties within a main group.

### **`group.subgroup_avatar_change`**

Indicates that a subgroup's avatar has been changed.

```json linenums="1" title="Event Object Structure"
{
  "type": "group.subgroup_avatar_change",
  "data": {
    "user": {
      "id": 93645911,
      "nickname": "bill"
    },
    "subgroup_topic": "test",
    "subgroup_avatar_url": "https://i.groupme.com/1170x2532.jpeg.efff7f6b52ee4ea1b25f081f3f4a6dd8",
    "parent_id": 108126494
  }
}
```

*   *type*

    string - Must be `group.subgroup_avatar_change`.

*   *data* (object) - Contains details of the subgroup avatar change.

    *   *user* (object) - Information about the user who changed the subgroup avatar.

        *   *id*

            number - The ID of the user (e.g., `93645911`). (See warning about User ID types).

        *   *nickname*

            string - The nickname of the user.

    *   *subgroup_topic*

        string - The current name/topic of the subgroup.

    *   *subgroup_avatar_url*

        string - The URL of the new subgroup avatar.

    *   *parent_id*

        number - The ID of the main group this subgroup belongs to.

***

### **`group.subgroup_description_change`**

Indicates that a subgroup's description has been changed.

```json linenums="1" title="Event Object Structure"
{
  "type": "group.subgroup_description_change",
  "data": {
    "user": {
      "id": 93645911,
      "nickname": "bill"
    },
    "subgroup_topic": "test topic",
    "subgroup_description": "new description",
    "parent_id": 108126494
  }
}
```

*   *type*

    string - Must be `group.subgroup_description_change`.

*   *data* (object) - Contains details of the subgroup description change.

    *   *user* (object) - Information about the user who changed the subgroup description.

        *   *id*

            number - The ID of the user (e.g., `93645911`). (See warning about User ID types).

        *   *nickname*

            string - The nickname of the user.

    *   *subgroup_topic*

        string - The name/topic of the subgroup.

    *   *subgroup_description*

        string - The new description for the subgroup.

    *   *parent_id*

        number - The ID of the main group this subgroup belongs to.

***

### **`group.subgroup_like_icon_change`**

Indicates that a subgroup's custom like icon has been changed or removed.

```json linenums="1" title="Event Object Structure"
{
  "type": "group.subgroup_like_icon_change",
  "data": {
    "user": {
      "id": 93645911,
      "nickname": "bill"
    },
    "subgroup_topic": "test topic",
    "parent_id": 108126494,
    "like_icon": {
      "pack_id": 1,
      "pack_index": 36,
      "type": "emoji"
    }
  }
}
```

*   *type*

    string - Must be `group.subgroup_like_icon_change`.

*   *data* (object) - Contains details of the subgroup like icon change.

    *   *user* (object) - Information about the user who changed the like icon.

        *   *id*

            number - The ID of the user (e.g., `93645911`). (See warning about User ID types).

        *   *nickname*

            string - The nickname of the user.

    *   *subgroup_topic*

        string - The name/topic of the subgroup.

    *   *parent_id*

        number - The ID of the main group this subgroup belongs to.

    *   *like_icon* (object or null) - Details of the custom like icon. If `null`, the custom like icon was removed.

        *   *pack_id*

            number - The ID of the emoji pack (if `like_icon` is not null).

        *   *pack_index*

            number - The index of the emoji within the pack (if `like_icon` is not null).

        *   *type*

            string - The type of like icon, e.g., "emoji" (if `like_icon` is not null).

***

### **`group.subgroup_name_change`**

Indicates that a subgroup's name (topic) has been changed.

```json linenums="1" title="Event Object Structure"
{
  "type": "group.subgroup_name_change",
  "data": {
    "user": {
      "id": 93645911,
      "nickname": "bill"
    },
    "subgroup_topic": "test",
    "parent_id": 108126494
  }
}
```

*   *type*

    string - Must be `group.subgroup_name_change`.

*   *data* (object) - Contains details of the subgroup name change.

    *   *user* (object) - Information about the user who changed the subgroup name.

        *   *id*

            number - The ID of the user (e.g., `93645911`). (See warning about User ID types).

        *   *nickname*

            string - The nickname of the user.

    *   *subgroup_topic*

        string - The new name/topic of the subgroup.

    *   *parent_id*

        number - The ID of the main group this subgroup belongs to.

***

### **`group.subgroup_type_change`**

Indicates that a subgroup's type (e.g., closed, announcement) has been changed.

```json linenums="1" title="Event Object Structure"
{
  "type": "group.subgroup_type_change",
  "data": {
    "user": {
      "id": 93645911,
      "nickname": "bill"
    },
    "subgroup_topic": "test topic",
    "parent_id": 108126494,
    "type": "closed",
    "message_edit_period": 15
  }
}
```

*   *type*

    string - Must be `group.subgroup_type_change`.

*   *data* (object) - Contains details of the subgroup type change.

    *   *user* (object) - Information about the user who changed the subgroup type.

        *   *id*

            number - The ID of the user (e.g., `93645911`). (See warning about User ID types).

        *   *nickname*

            string - The nickname of the user.

    *   *subgroup_topic*

        string - The name/topic of the subgroup.

    *   *parent_id*

        number - The ID of the main group this subgroup belongs to.

    *   *type*

        string - The new type of the subgroup (e.g., "closed", "announcement").

    *   *message_edit_period*

        number - The time window for message editing, corresponding to the type (e.g., `15` for closed, `43200` for announcement).

***

## Call Events

Events related to group calls.

### **`group.call.ended`**

Indicates that a group call has ended.

```json linenums="1" title="Event Object Structure"
{
  "type": "group.call.ended",
  "data": {
    "call_duration": 9770,
    "user": {
      "id": "system",
      "nickname": "system"
    }
  }
}
```

*   *type*

    string - Must be `group.call.ended`.

*   *data* (object) - Contains details about the ended call.

    *   *call_duration*

        number - The duration of the call in milliseconds.

    *   *user* (object) - Information about who ended the call.

        *   *id*

            string - The ID of the user who ended the call (e.g., `"system"`). In some cases, if a user ends it, this might be their numerical ID as a string or number - API is inconsistent. Example shows string.

        *   *nickname*

            string - The nickname of the user who ended the call (e.g., `"system"`).

***

### **`group.call.started`**

Indicates that a group call has been started.

```json linenums="1" title="Event Object Structure"
{
  "type": "group.call.started",
  "data": {
    "meeting_id": "https://api.scheduler.teams.microsoft.com/teamsforlife/9375167689078",
    "user": {
      "id": "93645911",
      "nickname": "bill"
    }
  }
}
```

*   *type*

    string - Must be `group.call.started`.

*   *data* (object) - Contains details about the started call.

    *   *meeting_id*

        string - A URL or identifier for the meeting, often related to Microsoft Teams.

    *   *user* (object) - Information about the user who started the call.

        *   *id*

            string - The ID of the user who started the call (e.g., `"93645911"`). (See warning about User ID types).

        *   *nickname*

            string - The nickname of the user who started the call.

***

## Poll Events

Events related to polls created within a group or subgroup.

### **`poll.created`**

Indicates that a new poll has been created.

```json linenums="1" title="Event Object Structure"
{
  "type": "poll.created",
  "data": {
    "conversation": {
      "id": "70077952"
    },
    "poll": {
      "id": "1693859560560113",
      "subject": "Up or Down?"
    },
    "user": {
      "id": "93645911",
      "nickname": "Totally NOT Isaac Stanger"
    }
  }
}
```

*   *type*

    string - Must be `poll.created`.

*   *data* (object) - Contains details of the created poll.

    *   *conversation* (object) - Information about the context of the poll.

        *   *id*

            string - The ID of the group or subgroup/conversation where the poll was created.

    *   *poll* (object) - Information about the poll itself.

        *   *id*

            string - The ID of the newly created poll.

        *   *subject*

            string - The question or subject of the poll.

    *   *user* (object) - Information about the user who created the poll.

        *   *id*

            string - The ID of the user who created the poll (e.g., `"93645911"`). (See warning about User ID types).

        *   *nickname*

            string - The nickname of the user who created the poll.

***

### **`poll.finished`**

Indicates that a poll has expired or been closed.

```json linenums="1" title="Event Object Structure"
{
  "type": "poll.finished",
  "data": {
    "conversation": {
      "id": "70077952"
    },
    "options": [
      {
        "id": "1",
        "title": "Up"
      },
      {
        "id": "2",
        "title": "Down",
        "voter_ids": ["93645911"],
        "votes": 1
      }
    ],
    "poll": {
      "id": "1693859560560113",
      "subject": "Up or Down?"
    }
  }
}
```

*   *type*

    string - Must be `poll.finished`.

*   *data* (object) - Contains details of the finished poll.

    *   *conversation* (object) - Information about the context of the poll.

        *   *id*

            string - The ID of the group or subgroup/conversation where the poll existed.

    *   *options* (array of objects) - The options that were available in the poll. Each object contains:

        *   *id*

            string - The ID of the poll option.

        *   *title*

            string - The text of the poll option.

        *   *voter_ids*

            array of strings (optional) - A list of user IDs who voted for this option.

        *   *votes*

            number (optional) - The number of votes this option received. May not be present if no votes or if data is incomplete.

    *   *poll* (object) - Information about the poll itself.

        *   *id*

            string - The ID of the poll that finished.

        *   *subject*

            string - The question or subject of the poll.

***

## Calendar Events

Events related to the group or DM calendar feature.

> [!note]
> These events can occur in both group chats and Direct Messages. In DMs, the relevant `conversation_id` in the message object will reflect the DM participants.

### **`calendar.event.cancelled`**

Indicates that a calendar event has been canceled.

```json linenums="1" title="Event Object Structure"
{
  "type": "calendar.event.cancelled",
  "data": {
    "event": {
      "id": "71907892652544fa891d65aba59ca4ec",
      "name": "Pool Party"
    },
    "user": {
      "id": "93645911",
      "nickname": "Totally NOT Isaac Stanger, SECOND ATTEMPT"
    }
  }
}
```

*   *type*

    string - Must be `calendar.event.cancelled`.

*   *data* (object) - Contains the details of the cancellation.

    *   *event* (object) - Information about the event that was cancelled.

        *   *id*

            string - The ID of the canceled calendar event.

        *   *name*

            string - The name of the canceled calendar event.

    *   *user* (object) - Information about the user who performed the action.

        *   *id*

            string - The ID of the user who canceled the event (e.g., `"93645911"`). (See warning about User ID types).

        *   *nickname*

            string - The nickname of the user who canceled the event.

***

### **`calendar.event.created`**

Indicates that a new calendar event has been created.

```json linenums="1" title="Event Object Structure"
{
  "type": "calendar.event.created",
  "data": {
    "event": {
      "id": "71907892652544fa891d65aba59ca4ec",
      "name": "Pool Party"
    },
    "url": "https://group.me/11wcjx0f81mMMJ",
    "user": {
      "id": "93645911",
      "nickname": "Totally NOT Isaac Stanger, SECOND ATTEMPT"
    }
  }
}
```

*   *type*

    string - Must be `calendar.event.created`.

*   *data* (object) - Contains the details of the created event.

    *   *event* (object) - Information about the newly created event.

        *   *id*

            string - The ID of the newly created calendar event.

        *   *name*

            string - The name of the newly created calendar event.

    *   *original_url*

        string (optional) - The full URL to the event on GroupMe's website. (Path may vary based on context, e.g., group ID or DM ID). May not always be present in WebSocket events.

    *   *url*

        string - A shortened URL to the event.

    *   *user* (object) - Information about the user who created the event.

        *   *id*

            string - The ID of the user who created the event (e.g., `"93645911"`). (See warning about User ID types).

        *   *nickname*

            string - The nickname of the user who created the event.

***

### **`calendar.event.starting`**

Indicates that a calendar event is starting soon or now.

```json linenums="1" title="Event Object Structure"
{
  "type": "calendar.event.starting",
  "data": {
    "call_started": false,
    "event_name": "test event",
    "minutes": "0"
  }
}
```

*   *type*

    string - Must be `calendar.event.starting`.

*   *data* (object) - Contains details about the starting event.

    *   *call_started*

        boolean - Indicates if a call was automatically started for this event.

    *   *event_name*

        string - The name of the event that is starting.

    *   *minutes*

        string - The number of minutes until the event starts (e.g., "0" for starting now, "15" for 15 minutes).

***

### **`calendar.event.updated`**

Indicates that a calendar event's details have been updated.

```json linenums="1" title="Event Object Structure"
{
  "type": "calendar.event.updated",
  "data": {
    "event": {
      "id": "5fae1217e4fc4a4180748b1d02234cfe",
      "name": "new calendar event edited"
    },
    "updated_fields": [
      "calendar.event.field.name"
    ],
    "user": {
      "id": "93645911",
      "nickname": "bill"
    }
  }
}
```

*   *type*

    string - Must be `calendar.event.updated`.

*   *data* (object) - Contains details of the update.

    *   *event* (object) - Information about the updated event.

        *   *id*

            string - The ID of the updated calendar event.

        *   *name*

            string - The current (potentially updated) name of the calendar event.

    *   *updated_fields*

        array of strings - A list of fields that were updated (e.g., `"calendar.event.field.name"`, `"calendar.event.field.description"`, `"calendar.event.field.time"`).

    *   *user* (object) - Information about the user who updated the event.

        *   *id*

            string - The ID of the user who updated the event (e.g., `"93645911"`). (See warning about User ID types).

        *   *nickname*

            string - The nickname of the user who updated the event.

***

### **`calendar.event.user.going`**

Indicates a user has RSVP'd as "going" to a calendar event.

```json linenums="1" title="Event Object Structure"
{
  "type": "calendar.event.user.going",
  "data": {
    "event": {
      "id": "71907892652544fa891d65aba59ca4ec",
      "name": "Pool Party"
    },
    "user": {
      "id": "93645911",
      "nickname": "Totally NOT Isaac Stanger, SECOND ATTEMPT"
    }
  }
}
```

*   *type*

    string - Must be `calendar.event.user.going`.

*   *data* (object) - Contains details of the RSVP.

    *   *event* (object) - Information about the event.

        *   *id*

            string - The ID of the calendar event.

        *   *name*

            string - The name of the calendar event.

    *   *user* (object) - Information about the user who RSVP'd.

        *   *id*

            string - The ID of the user who RSVP'd (e.g., `"93645911"`). (See warning about User ID types).

        *   *nickname*

            string - The nickname of the user who RSVP'd.

***

### **`calendar.event.user.not_going`**

Indicates a user has RSVP'd as "not going" to a calendar event.

```json linenums="1" title="Event Object Structure"
{
  "type": "calendar.event.user.not_going",
  "data": {
    "event": {
      "id": "71907892652544fa891d65aba59ca4ec",
      "name": "Pool Party"
    },
    "user": {
      "id": "93645911",
      "nickname": "Totally NOT Isaac Stanger, SECOND ATTEMPT"
    }
  }
}
```

*   *type*

    string - Must be `calendar.event.user.not_going`.

*   *data* (object) - Contains details of the RSVP.

    *   *event* (object) - Information about the event.

        *   *id*

            string - The ID of the calendar event.

        *   *name*

            string - The name of the calendar event.

    *   *user* (object) - Information about the user who RSVP'd.

        *   *id*

            string - The ID of the user who RSVP'd (e.g., `"93645911"`). (See warning about User ID types).

        *   *nickname*

            string - The nickname of the user who RSVP'd.

***

### **`calendar.event.user.undecided`**

Indicates a user has changed their RSVP to "undecided" for a calendar event.

```json linenums="1" title="Event Object Structure"
{
  "type": "calendar.event.user.undecided",
  "data": {
    "event": {
      "id": "44da0b1d715841d8b855d0ae0833b9e8",
      "name": "test event"
    },
    "user": {
      "id": "93645911",
      "nickname": "Totally NOT Isaac Stanger, SECOND ATTEMPT"
    }
  }
}
```

*   *type*

    string - Must be `calendar.event.user.undecided`.

*   *data* (object) - Contains details of the RSVP change.

    *   *event* (object) - Information about the event.

        *   *id*

            string - The ID of the calendar event.

        *   *name*

            string - The name of the calendar event.

    *   *user* (object) - Information about the user who changed their RSVP.

        *   *id*

            string - The ID of the user who changed their RSVP (e.g., `"93645911"`). (See warning about User ID types).

        *   *nickname*

            string - The nickname of the user who changed their RSVP.

***

## General Message Events

Events that can apply to messages in various contexts (groups, DMs, subgroups).

### **`message.deleted`**

Indicates that a message has been deleted.

```json linenums="1" title="Event Object Structure"
{
  "type": "message.deleted",
  "data": {
    "deleted_at": 1693862956,
    "deletion_actor": "sender",
    "message_id": "169386238854117065"
  }
}
```

*   *type*

    string - Must be `message.deleted`.

*   *data* (object) - Contains details about the deleted message.

    *   *deleted_at*

        number - Unix timestamp (seconds) of when the message was deleted.

    *   *deletion_actor*

        string - Who deleted the message (e.g., `"sender"`, `"admin"`).

    *   *message_id*

        string - The ID of the message that was deleted.

***

### **`message.pinned`**

Indicates that a message has been pinned in the chat.

```json linenums="1" title="Event Object Structure"
{
  "type": "message.pinned",
  "data": {
    "message_id": "169386238854117065",
    "pinned": true,
    "pinned_by": "74938777",
    "pinned_at": 1693862497
  }
}
```

*   *type*

    string - Must be `message.pinned`.

*   *data* (object) - Contains details of the pinned message.

    *   *message_id*

        string - The ID of the message that was pinned.

    *   *pinned*

        boolean - Always `true` for this event type.

    *   *pinned_by*

        string - The user ID of the person who pinned the message (e.g., `"74938777"`). (See warning about User ID types).

    *   *pinned_at*

        number - Unix timestamp (seconds) of when the message was pinned.

***

### **`message.unpinned`**

Indicates that a message has been unpinned in the chat.

```json linenums="1" title="Event Object Structure"
{
  "type": "message.unpinned",
  "data": {
    "message_id": "169386238854117065",
    "unpinned": true
  }
}
```

*   *type*

    string - Must be `message.unpinned`.

*   *data* (object) - Contains details of the unpinned message.

    *   *message_id*

        string - The ID of the message that was unpinned.

    *   *unpinned*

        boolean - Always `true` for this event type.
    *(Note: `unpinned_by` and `unpinned_at` were not observed in the example for this event type).*

***

## Bot Events

Events related to bots being added, removed, or modified in a group.

### **`bot.add`**

Indicates that a bot has been added to the group.

```json linenums="1" title="Event Object Structure"
{
  "type": "bot.add",
  "data": {
    "user": {
      "id": 93645911,
      "nickname": "Isaac"
    },
    "bot": "jerry"
  }
}
```

*   *type*

    string - Must be `bot.add`.

*   *data* (object) - Contains details of the bot addition.

    *   *user* (object) - Information about the user who added the bot.

        *   *id*

            number - The ID of the user who added the bot (e.g., `93645911`). (See warning about User ID types).

        *   *nickname*

            string - The nickname of the user who added the bot.

    *   *bot*

        string - The name of the bot that was added.

***

### **`bot.del`**

Indicates that a bot has been removed from the group.

```json linenums="1" title="Event Object Structure"
{
  "type": "bot.del",
  "data": {
    "user": {
      "id": 93645911,
      "nickname": "Isaac"
    },
    "bot": "tom"
  }
}
```

*   *type*

    string - Must be `bot.del`.

*   *data* (object) - Contains details of the bot removal.

    *   *user* (object) - Information about the user who removed the bot.

        *   *id*

            number - The ID of the user who removed the bot (e.g., `93645911`). (See warning about User ID types).

        *   *nickname*

            string - The nickname of the user who removed the bot.

    *   *bot*

        string - The name of the bot that was removed.

***

### **`bot.rename`**

Indicates that a bot has been renamed.

```json linenums="1" title="Event Object Structure"
{
  "type": "bot.rename",
  "data": {
    "user": {
      "id": 93645911,
      "nickname": "Isaac"
    },
    "bot_name_old": "jerry",
    "bot_name_new": "tom"
  }
}
```

*   *type*

    string - Must be `bot.rename`.

*   *data* (object) - Contains details of the bot rename.

    *   *user* (object) - Information about the user who renamed the bot.

        *   *id*

            number - The ID of the user who renamed the bot (e.g., `93645911`). (See warning about User ID types).

        *   *nickname*

            string - The nickname of the user who renamed the bot.

    *   *bot_name_old*

        string - The previous name of the bot.

    *   *bot_name_new*

        string - The new name of the bot.

***

## Copilot Events

Events related to the GroupMe Copilot (AI assistant) feature.

### **`copilot.group.privacy_notice`**

Indicates that a privacy notice regarding the Copilot feature has been posted in the group. This typically occurs when Copilot is activated or first mentioned.

```json linenums="1" title="Event Object Structure"
{
  "type": "copilot.group.privacy_notice",
  "data": {
    "trigger_message": "174959917958988616"
  }
}
```

*   *type*

    string - Must be `copilot.group.privacy_notice`.

*   *data* (object) - Contains details related to the notice.

    *   *trigger_message*

        string - The ID of the message that likely triggered the display of this privacy notice.

***
> [!note]
> There might be other event types or variations not covered here. If you find any, please edit this page and submit a pull request.
