---
title: "Oauth / MFA Management"
description: "Learn to manage GroupMe API tokens programmatically"
---

# Oauth / MFA Management

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

## Logging In

This is how you authenticate a GroupMe account's email and password in order to receive an API token. 

Sometimes, when an account has MFA enabled or you're logging in from a new device, this call requires a user to answer an MFA challenge using a pin sent to their phone and then retry logging in using the code attached to the MFA interaction.

> [!important]
> This request is relative to `https://v2.groupme.com/`, not `https://api.groupme.com/v3/`.

```json linenums="1" title="HTTP Request"
POST https://v2.groupme.com/access_tokens
{
  "app_id": "groupme-web",
  "device_id": "27f34b56f0687987a85201f1f2e872ed",
  "grant_type": "password",
  "password": "12345678",
  "username": "email@example.com",
  "verification": {
    "code": "5bdbac1c43224a21d02dc94747ae732e31161ba4-2e26f6cd2c6a92038936993e8b9886bd731c6e54"
  }
}
```

**Parameters**

* *app_id* (required)

    string - the name of the application you're attempting to authorize, this can be anything.

* *grant_type* (required)

    string - as far as we're aware, the only acceptable value for this parameter is `"password"`.

* *password* (required)

    string - your GroupMe account's password

* *username* (required)

    string - the username or email registered with your account

* *device_id*

    string - this is an optional device identifier which is stored by GroupMe. It can be anything you want, but it should be specific to the device/client. If you haven't logged in with this device ID before (or if you leave it empty), the server will Force an MFA challenge by verifying your phone number. Even if MFA is not enabled for your account.

* *verification*

    object - this optional object contains the parameter `code`, which should be set to a valid MFA interaction ID if you have one. Normally you send this API call once without this parameter, then if you receive an an MFA challenge, you'd solve the challenge and try this call again, including the `verification` parameter.

```json linenums="1" title="HTTP Response"
Status: 200 OK
{
  "access_token": "OSJ05EiYrWfLmWz23DvrYEhzafflWMAqWZjjHJOT",
  "user_id": "93645911",
  "user_name": "Bob",
  "expires_at": 1749674981,
  "user": {
    "id": "93645911",
    "name": "Isaac",
    "email": "email@example.com",
    "avatar_url": "https://i.groupme.com/200x200.jpeg.94e0ac5891aa4e6f8ad4bbf961defe4d",
    "admin": false
  }
}
```

Or, if an MFA challenge is thrown:

See how to authorize this MFA verification code in the next section.

```json linenums="1" title="HTTP Response"
Status: 202 Accepted
{
  "verification": {
    "code": "5bdbac1c43224a21d02dc94747ae732e31161ba4-700d069528b2364ebc32b9f721b25d93239279d3",
    "methods": {
      "call": "43",
      "sms": "43",
      "email": "em***********@example.com"
    },
    "status": "unverified",
    "type": "force",
    "long_pin": "c9b6acf22f61",
    "system_number": "+1 5095931886"
  }
}
```
***

## Handling MFA Challenges

The MFA system is relatively straightforward. When the server requires multi-factor authentication, it will issue the client an MFA code ID. 

Your client follows one of a few methods to verify that MFA ID, and then passes it back to the server.

**Option 1: They text you**

To tell the server to send a text:

```json linenums="1" title="HTTP Request"
POST /verifications/:mfa_id/initiate
{
  "verification": {
    "method": "sms"
  }
}
```

**Parameters**

* *mfa_id*

    string - this is the long string given to you whenever the server requires an MFA challenge. It should look something like: `5bdbac1c43224a21d02dc94747ae732e31161ba4-700d069528b2364ebc32b9f721b25d93239279d3`.

```json linenums="1" title="HTTP Response"
Status: 200 OK
{
  "hint": "22"
}
```

Now you can verify the pin:

```json linenums="1" title="HTTP Request"
POST /verifications/:mfa_id/confirm
{
  "verification": {
    "pin": "1234"
  }
}
```

**Parameters**

* *mfa_id*

    string - this is the long string given to you whenever the server requires an MFA challenge.

* *pin*

    string - the pin texted to you when you initiated the MFA challenge. Alternatively, this can be a backup code that was generated when you initially activated MFA for your account.

If the pin is correct, you will receive a response that looks like this:

```json linenums="1" title="HTTP Response"
Status: 200 OK
{
  "status": 20000
}
```

If the pin was incorrect, you will receive a response indicating how many tries you have left.

```json linenums="1" title="HTTP Response"
Status: 400 Bad Request
{
  "remaining_attempts": 2
}
```

At this point, the MFA code you've been given should be verified and you can pass it along to whatever call initiated the MFA interaction.

***

**Option 2: You text them**

This doesn't require an initiation step, instead, you send a text containing the `long_pin` to the `system_number` provided when the server issues an MFA challenge. 

Official clients use a text that looks like this:

```linenums="1" title="Text"
Send this text to verify this phone number: (c9b6acf22f61)
```

Where `c9b6acf22f61` is the `long_pin` you received from the server.

Because sending a text is asynchronous, you need to wait and validate that the server has received your SMS before attempting to use the MFA ID. You can do this via polling the ID to see if it's validated yet.

> [!tip]
> You can use this call to check if any MFA ID is valid, not just ones where you're sending the text. It's most relevant here, so thats why we include it.

```json linenums="1" title="HTTP Request"
GET /verifications/:mfa_id
```

**Parameters**

* *mfa_id*

    string - this is the long string given to you whenever the server requires an MFA challenge. It should look something like: `5bdbac1c43224a21d02dc94747ae732e31161ba4-700d069528b2364ebc32b9f721b25d93239279d3`.

```json linenums="1" title="HTTP Response if Verified"
Status: 200 OK
{
  "verification": {
    "code": "5bdbac1c43224a21d02dc94747ae732e31161ba4-700d069528b2364ebc32b9f721b25d93239279d3",
    "methods": {
      "call": "43",
      "sms": "43",
      "email": "em***********@example.com"
    },
    "status": "verified",
    "type": "force",
    "long_pin": "c9b6acf22f61",
    "system_number": "+1 5095931886"
  }
}
```

```json linenums="1" title="HTTP Response if not yet Verified"
Status: 200 OK
{
  "verification": {
    "code": "5bdbac1c43224a21d02dc94747ae732e31161ba4-700d069528b2364ebc32b9f721b25d93239279d3",
    "methods": {
      "call": "43",
      "sms": "43",
      "email": "em***********@example.com"
    },
    "status": "unverified",
    "type": "force",
    "long_pin": "c9b6acf22f61",
    "system_number": "+1 5095931886"
  }
}
```

At this point, the MFA code you've been given should be verified and you can pass it along to whatever call initiated the MFA interaction.

***

## Creating an MFA backup code

This allows you to pass an MFA challenge without access to your phone. It's submitted exactly the same way you would an SMS pin.

```json linenums="1" title="HTTP Request"
POST /user/mfa/backup
```

```json linenums="1" title="HTTP Response"
Status: 200 OK
{
  "mfa": {
    "backup_code": "cuzmg-xo2xm"
  }
}
```

***

## Enabling MFA

This call activates an MFA channel for your account, it works just like logging in. 

You make this call once without an MFA verification object, receive an MFA ID for the interaction, validate it using the steps detailed in the [Handling MFA Challenges](#Handling-MFA-Challenges) section, then make this call a second time including the now verified MFA ID.

After establishing the MFA channel you must enable it with a seperate call.

> [!important]
> Activating MFA will log you out *everywhere*, including 3rd party Oauth apps. This proccess will invalidate your current API token and return a new one that you should use to make subsequent API calls.

```json linenums="1" title="HTTP Request"
POST /user/mfa
{
  "channel": {
    "method": "phone_number"
  },
  "verification": {
    "code": "5bdbac1c43224a21d02dc94747ae732e31161ba4-5deced22aa9ceeb24c2d6501f5f293188dee872f"
  }
}
```

**Parameters**

* *method* (required)

    string - Must be `"phone_number"` (the only known working method)

* *code*

    string - A verified MFA ID obtained by completing the verification challenge. This only needs to be inlcuded on the second request you make to this endpoint.

On the first call you make, whithout sending a verification code, the response should look like this:

```json linenums="1" title="HTTP Response"
Status: 202 Accepted
{
  "verification": {
    "code": "5bdbac1c43224a21d02dc94747ae732e31161ba4-5deced22aa9ceeb24c2d6501f5f293188dee872f",
    "methods": {
      "sms": "22",
      "call": "22"
    },
    "status": "unverified",
    "long_pin": "8b4801ccd56b",
    "system_number": "+1 2533728988"
  }
}
```

After the second call including a verified MFA ID, the response should look like this:

```json linenums="1" title="HTTP Response"
Status: 201 Created
{
  "status": 20100
}
```

Now that the MFA channel is established, we can enable it like this:

```json linenums="1" title="HTTP Request"
POST /user/mfa
{
  "mfa": {
    "status": "enable"
  }
}
```

```json linenums="1" title="HTTP Response"
Status: 200 OK
{
  "mfa": {
    "backup_code": "h1mie-y775n"
  },
  "access_token": {
    "access_token": "s0i7K5Jif0u4YS7hOKa8SyADgWHUs4D4ulBqX1di",
    "user_id": "93645911",
    "user_name": "Bob",
    "expires_at": null,
    "user": {
      "id": "93645911",
      "name": "Bob",
      "email": "email@example.com",
      "avatar_url": "https://i.groupme.com/200x200.jpeg.94e0ac5891aa4e6f8ad4bbf961defe4d",
      "admin": false
    }
  }
}
```

***

## Disabling MFA

This call turns off MFA for your account

```json linenums="1" title="HTTP Request"
POST /user/mfa
{
  "mfa": {
    "status": "disable"
  }
}
```

```json linenums="1" title="HTTP Response"
Status: 200 OK
```

***

## Index authorized apps

List applications with active tokens. 

Please note that this call does not list the tokens themselves, or when they will expire. It only provides enough information to tell you which clients currently have access to your account.

> [!important]
> This request is relative to `https://v2.groupme.com/`, not `https://api.groupme.com/v3/`.

```json linenums="1" title="HTTP Request"
GET https://v2.groupme.com/access_tokens
```

```json linenums="1" title="HTTP Response"
Status: 200 OK
{
  "access_tokens": [
    {
      "id": 323024813,
      "created_at": "2025-05-28T21:23:02.5949Z",
      "app_id": "GroupMe-iOS"
    },
    {
      "id": 323044533,
      "created_at": "2025-05-28T21:20:04.0170Z",
      "app_id": "groupme-web"
    }
  ]
}
```

***

## Revoking an API token / Oauth Application

This call invalidates a token with a particular token ID, which can be identified using the call above.

> [!important]
> This request is relative to `https://v2.groupme.com/`, not `https://api.groupme.com/v3/`.

```json linenums="1" title="HTTP Request"
POST https://v2.groupme.com/access_tokens/:token_id/destroy
```

**Parameters**

* *token_id*

    string - the ID of the token you want to revoke. This can be found in the `GET /access_tokens` response.

```json linenums="1" title="HTTP Response"
Status: 200 OK
```

***

## Revoking Your Own Token (Logging Out)

This call invalidates whatever API token is used to make the call.

```json linenums="1" title="HTTP Request"
POST /web_pings/destroy
```

```json linenums="1" title="HTTP Response"
Status: 200 OK
```

***

## Changing your Account Password

> [!important]
> This call will log you out *everywhere* and will revoke the token you're currently using. In order to get a new API token, you will need to [log back in](#Logging-In) with your new password

```json linenums="1" title="HTTP Request"
POST /users/password
{
  "password": "12345678",
  "password_current": "blahblahblah"
}
```

**Parameters**

* *password*

    string - this is your new password

* *password_current*

    string - this is your current password

```json linenums="1" title="HTTP Response"
Status: 201 Created
{}
```
