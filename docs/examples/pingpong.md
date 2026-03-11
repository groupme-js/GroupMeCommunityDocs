# PingPong Bot

PingPong Bot is a simple yet effective example that demonstrates how a bot can **reply directly to a specific message** in a GroupMe chat. When a user sends `!ping`, the bot responds with "Pong! 🏓" as a threaded reply, visually linking its response to the original command.

This example is perfect for showing how to use the `reply` and `mention` attachments, which are core feature of the GroupMe API for creating interactive, conversational bots.

## Setup

Before you can run PingPong Bot, you need a GroupMe bot and its associated Bot ID.

1.  **Create a Bot:** The easiest way to create a bot is to use [GroupMe's Bot Creation form](https://dev.groupme.com/bots/new). Set a name and make sure to configure the **Callback URL** to point to your server (e.g., `https://your-server-url.com/callback`).

2.  **Install Dependencies:** This script requires the `express` framework to run a web server. Create a new Node.js project and install it by running the following commands in your terminal:

    ```bash
    npm init -y
    npm install express
    ```

3.  **Configure Bot ID:** You must add your Bot ID to the script. Open the `PingPong.js` file and replace the `[Your Bot ID Here]` placeholder with your actual Bot ID.

You can read more about creating and managing bots in the [Bots API Reference](../api/bots/index.md).

## The `reply` Attachment

Unlike a standard message, a reply visually links the bot's response to the user's original message in the chat. This is accomplished by including an `attachments` array in your post request with a `reply` type. The `reply` object must contain the `reply_id` of the message you are replying to. This creates a much more natural, threaded conversation flow.

Replies have a unique identifier called `base_reply_id`, which is the ID of the original message. It basically goes unused by GroupMe as none of the current clients support it, but it should typically be set to the same value as `reply_id` for consistency (Or the first message in a reply chain if you know it, but sometimes it's a pain to find).

## The `mention` Attachment

The `mention` attachment allows you to mention a user in your bot's response. This is useful for drawing attention to the user who sent the original message. The `user_ids` array should contain the ID of the user you want to mention, and the `loci` array specifies the range of text that will be highlighted as a mention, where the first number is the start index and the second number is the length of the mention text.

For more information on how to use message attachments, see the [Attachments](../common/index.md#attachments) documentation.

## PingPong Bot Script

This script creates a web server that listens for POST requests from GroupMe. It checks incoming messages for the `!ping` command. When it finds one, it extracts the original message's ID and uses it to send a threaded reply back to the group.

You can save this code in a file named `PingPong.js` and run it using Node.js with this command:

```bash
node PingPong.js
```

Here's the corrected and documented code for PingPong Bot:

```js linenums="1" title="PingPong.js"
const express = require('express'); // Import the express framework for handling HTTP requests

const app = express();
app.use(express.json());

// --- Configuration ---
const PORT = process.env.PORT || 3000; // Port for the bot to listen on
const BOT_ID = '[Your Bot ID Here]'; // Your Bot ID from the GroupMe Developer Portal
const CALLBACK_URL = '/callback'; // The URL path where GroupMe will send POST requests

app.post(CALLBACK_URL, async (req, res) => {
  const message = req.body;

  // Basic validation to ensure we have the data we need.
  if (!message || !message.text) {
    return res.status(400).send('Invalid request');
  }

  const text = message.text.toLowerCase();

  if (text.startsWith('!ping')) {
    try {
      // Construct the API request payload, including the reply attachment.
      const payload = {
        bot_id: BOT_ID,
        text: message.name + " Pong! 🏓",
        attachments: [
          {
            type: 'mention', // This is optional, but can be used to mention the user who sent the original message.
            user_ids: [ message.sender_id ], // The ID of the user who sent the original message.
            loci: [0, message.name.length] // The range of the text to mention.
          },
          {
            type: 'reply',
            reply_id: message.id,      // The ID of the message to reply to.
            base_reply_id: message.id, // The base message of the reply thread.
          }
        ],
      };

      await fetch('https://api.groupme.com/v3/bots/post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload), // The body must be a JSON string.
      });

      // Let GroupMe know the reply was successfully initiated.
      return res.status(202).send('Accepted');

    } catch (error) {
      console.error('Error sending pong:', error);
      return res.status(500).send('Failed to send pong');
    }
  }

  // If the message wasn't '!ping', acknowledge it with a 200 OK status.
  // This is important to prevent GroupMe from resending the same message.
  res.status(200).send('OK');
});

// Start the bot
app.listen(PORT, () => console.log(`🏓 PingPong Bot running on port ${PORT}`));
```