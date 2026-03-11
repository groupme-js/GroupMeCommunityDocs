# DinoBot

DinoBot is a simple webhook bot for GroupMe, originally written in C# by Microsoft as a demo for GroupMe's Bot API. This is a Node.js port of the original bot, which responds to messages in a GroupMe group by sending dinosaur emojis.

## Setup

Before you can run DinoBot, you need to set up a GroupMe bot and a callback URL that points to your server/host where the bot will receive and handle messages. The easisest way to create a bot is to use [GroupMe's Bot Creation form](https://dev.groupme.com/bots/new), where you can specify the bot's name, avatar, and callback URL. Alternatively, you can create a bot using the API and your user account's API token. Read more about creating and managing bots in the [Bots API Reference](../api/bots/index.md).

After registering a new bot with GroupMe, create a new Node.js project and install express.js (An HTTP server framework for JavaScript we will use to catch GroupMe's POST messages to our callback URL).

You can do this by running the following commands in your terminal:

```bash
npm init -y
npm install express
```

## DinoBot Script

This is the main script for DinoBot, which listens for messages in a GroupMe group and responds with dinosaur emojis based on certain triggers. The bot can respond to requests for dinos, mentions of its name, or random questions.

You can save this code in a file named `DinoBot.js`, and run it using Node.js with this command:

```bash
node DinoBot.js
```

Without further ado, here's the code for DinoBot. Feel free to modify it to suit your needs or add more features!

```js linenums="1" title="DinoBot.js"
const express = require('express'); // Import the express framework for handling HTTP requests

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000; // Port for the bot to listen on
const CALLBACK_URL = '/DinoCallback' // The URL path where GroupMe will send POST requests
const BOT_ID = '[Your Bot ID Here]'; // Your Bot ID from the GroupMe Developer Portal

const MAX_DINOS = 100; // Maximum number of dinos DinoBot can send in one go
const RESPONSE_WEIGHT = 0.075; // Probability DinoBot will answer a question
const CAN_ADDRESS_DINO = []; // empty means everyone, add user IDs to only allow specific users to address the bot

async function postEmoji(count, BOT_ID) {
  if (count > MAX_DINOS) count = MAX_DINOS;

  const placeholder = '�' // Placeholder character to be replaced by the emoji
  const charmap = Array(count).fill([1, 62]); // 1 is the emoji's pack ID, 62 is the pack index for the dinosaur emoji

  await fetch('https://api.groupme.com/v3/bots/post', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      bot_id: BOT_ID,
      text: placeholder.repeat(count),
      attachments: [
        {
          type: 'emoji',
          placeholder,
          charmap
        }
      ]
    }),
  });
}

// handle POST requests from GroupMe hitting DinoBot's callback URL
app.post(CALLBACK_URL, async (req, res) => {
  const msg = req.body;

  if (!msg || !msg.text) {
    return res.status(400).send('Invalid request');
  }

  const text = msg.text.toLowerCase();

  // respond if someone asks for dinos. Try saying "1 dino" or "5 dinosaurs"
  const DINO_REGEX = /^(\d+)\s+(dino(?:s|saur)?)/; // Regex to match "N dino(s)" or "N dinosaur(s)"
  const dinoMatch = DINO_REGEX.exec(text);
  if (dinoMatch) {
    const num = Math.min(parseInt(dinoMatch[2]), MAX_DINOS);
    if (num > 0) {
      await postEmoji(num);
      return res.status(201);
    }
  }

  // respond if someone says DinoBot's name. Try saying "What's up DinoBot?"
  if (text.includes('dinobot')) {
    await postEmoji(1);
    return res.status(201);
  }

  // respond on the off chance dino knows a good answer. Try asking "What is the meaning of life?" or "How do I make a sandwich?"
  if (text.includes('?') && Math.random() < RESPONSE_WEIGHT) {
    await postEmoji(1);
    return res.status(201);
  }

  res.status(200);
});

// Start the bot
app.listen(PORT, () => console.log(`🦕 DinoBot running on port ${PORT}`));
```