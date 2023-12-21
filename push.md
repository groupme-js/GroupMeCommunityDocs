# Push Service

The GroupMe Push Service is strange and finnicky, so giving precise documentation about it is hard.
The [official documentation](https://dev.groupme.com/tutorials/push) has a lot of outdated and incomplete information,
and it's hard (for me, at least) to figure out what's required and what's not.

Hopefully someone can figure out how it works and add some details here, but until then, here are some working
implementations:

* [My bot, Lowes.](https://github.com/2CATteam/gmuserbot/blob/master/bot.js) I'm sure I stole this working code from
  somewhere, but I can't for the life of me figure out where.

* [groupme_push](https://github.com/cuuush/groupme-push), a groupme push implementation in Python. 

* [The GroupMe npm package](https://github.com/njoubert/node-groupme/blob/master/lib/IncomingStream.js)

Here is a list of some known WebSocket types and what they correspond to:

* `ping` -> A ping from the web socket server
* `line.create` -> New Group Message. This includes anything that makes a message such as calendar events,
  joining/leaving events, polls, etc.
* `like.create` -> Someone likes a message that is yours in a group
* `favorite` -> Someone likes a message that is not yours in a group
* `direct_message.create` -> New Direct Message

Please help improve this page with more examples or, hopefully, some better information on how it works to begin with,
and potentially a guide on how to use it.
