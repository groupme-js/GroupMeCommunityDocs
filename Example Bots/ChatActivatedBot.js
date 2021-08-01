/**
 * When added to a chat, this bot will listen to messages and if a message contains "!test",
 * it will respond with "Test Successful"
 *
 * If you wish to run this locally to test I suggest using ngrok (https://ngrok.com/). Once installed,
 * run the command "./ngrok http 3000". Take the https forwarding url it gives and use it for your
 * GroupMe Bot callback URL. You will also need to change the "botId" variable in this code to your own
 * bot id.
 */

const express = require('express'); // Handles routing for incoming request
const axios = require('axios').default; // For sending requests to GroupMe
const app = express();
const port = 3000; // Port on which the app is run

/** The GroupMe API Endpoint for bots to send messages */
const url = 'https://api.groupme.com/v3/bots/post';

/** Your bot id from GroupMe */
const botId = '[Your Bot ID Here]';

/** Telling express that GroupMe will be sending us JSON */
app.use(express.json());

/**
 * Makes bot send given message via post request to GroupMe
 * @param {string} message
 */
const sendMessage = (message) => {
    /*** Send post request to GroupMe with message and Bot ID. Could add a .then() to get response from GroupMe */
    axios.post(url, {
        text: message,
        bot_id: botId
    })
        .then(response => console.log(response.statusText))
        .catch(error => console.log(error.response.data))

}

/**
 * The /bot endpoint that will be called by GroupMe
 */
app.post('/bot', (req, res) => {
    /** *Get the request body from GroupMe. To see full response log this or look at the Callback section on https://dev.groupme.com/tutorials/bots */
    const body = req.body;

    /*** If the message text includes !test send success message */
    if (body.text.includes('!test'))
        sendMessage('Test Successful!');

    /*** Respond Success to GroupMe Server */
    res.sendStatus(200);
})

/**
 * Starts the server
 */
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
})
