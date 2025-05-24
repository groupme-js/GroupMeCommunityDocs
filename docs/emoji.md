# Emoji Packs (PowerUps)

GroupMe allows users to send special non-standard (non-Unicode) emoji. They're basically just small inline images. These emojis are also known as Powerups.

If any message contains special GroupMe emoji, there will be an attachment in the attachments list defining the emoji in the message.

Here's the JSON response for a sample message containing emoji:

```json

{
  "attachments": [
    {
      "charmap": [
        [3, 13],
        [3, 12],
        [3, 11]
      ],
      "placeholder": "�",
      "type": "emoji"
    }
  ],
  "avatar_url": "[avatar url will go here]",
  "created_at": 1234567890, 
  "favorited_by": [],
  "group_id": "98765432",
  "id": "123456789012345678",
  "name": "Firstname Lastname",
  "sender_id": "12345678",
  "sender_type": "user",
  "source_guid": "android-e8b9d6c9-d2d7-4b9c-b140-1419f60cb1b5",
  "system": false,
  "text": "���",
  "user_id": "12345678",
  "platform": "gm"
}

```

The message text contains a placeholder Unicode character that defines where the user inserted emoji into their message.
Note that these � characters alone don't convey any information about *which* emoji was sent--that information is provided in the attachment. The � characters
are merely placeholders to be replaced later on with the emoji images.

The JSON format for the emoji attachment looks like this:

```json
{
  "charmap": [
    [3, 13],
    [3, 12],
    [3, 11]
  ],
  "placeholder": "�",
  "type": "emoji"
}
```

The `placeholder` attribute tells you the Unicode character you should replace with an image (this is the same character that shows up in the
message `text`).

The `charmap` attribute tells you which emojis were used in the message (see the next section for details).

Notice how there's only one � character given in the `placeholder` even though there are several emojis I used in this message. That's because each � character
represents a different emoji in the `charmap`. So, the first � character in the message text represents the first item in the charmap array `[3, 13]`, the second � character
represents the second item `[3, 12]`, and so on. So, if you're writing code to display these emojis, I would recommend looping through the `charmap` and replace the first `placeholder` character in the text with the emoji.

Each emoji in the `charmap` is represented as an array of two integers (ex. `[3, 13]`). The first integer in the array is the emoji **pack number**--it tells
you which emoji pack it came from. The second character is the **emoji index**--this tells you the specific emoji inside the pack. So, with the example `[3, 13]`,
this is the 13th emoji in the 3rd emoji pack.

## Finding which emoji is which

If you have the GroupMe app on your device, open a chat and click on the emoji button next to the text box. The emoji packs are the tabs across the top
(GroupMe Emoji, Summer, Back to School, Halloween, etc), and you can click on one of the tabs to see the emojis inside the pack. **Note: The packs in the GroupMe app are not
necessarily in the same order as the pack number!** More on that later.

There's also an API endpoint which will give you all the emoji packs in JSON format--just send a GET request to `https://powerup.groupme.com/powerups` (you
don't need to use an API key). The returned data looks like this (note: To save space, I reduced the results to show only a few emoji from one pack. If you'd
like to see all the emoji packs, you can check out the full JSON at [https://powerup.groupme.com/powerups](https://powerup.groupme.com/powerups)):

```json
{
  "powerups": [
    {
      "id": "emoji-groupme",
      "name": "GroupMe Emoji",
      "description": "#)",
      "type": "emoji",
      "created_at": 1368809636,
      "updated_at": 1600905600,
      "store_icon": null,
      "screenshots": null,
      "meta": {
        "pack_id": 1,
        "transliterations": [
          "smiley face",
          "happy face",
          "pleased face",
          "content face",
          "winky face",
          "thrilled face",
          "swoon face",
          "clown face",
          "goofy face",
          "silly face",
          "neil face",
          "glasses face",
          "cool guy face",
          "cigar face",
          "blank face",
          "bummed face",
          "sad face",
          "tearful face",
          "crying face",
          "nervous face",
          "frustrated face",
          "mad face",
          "conniving face",
          "grossed out face",
          "sick face",
          "puking face",
          "dead face",
          "yawn face",
          "surprised face",
          "shocked face",
          "stoney face",
          "tweak face",
          "kissy face",
          "surprised glasses face",
          "hand over mouth face",
          "hands over eyes face",
          "confused face",
          "zipper mouth face",
          "sleeping face",
          "caffeinated face",
          "emo face",
          "gasp face",
          "goatee face",
          "steve",
          "jared",
          "iced coffee",
          "latte",
          "icecream cookie",
          "hotsauce",
          "tacotaco",
          "pizza",
          "popping bottle",
          "brown bottle",
          "lighter",
          "red solo cup",
          "pingpong",
          "pinball flipper",
          "pink electric guitar",
          "wet wipes",
          "dead fish",
          "petey",
          "pivotal",
          "dino",
          "heart",
          "badge icon",
          "grilled cheese",
          "poundie",
          "frowndie",
          "headphones poundie",
          "blonde poundie",
          "nerdie poundie",
          "evil poundie",
          "angel poundie",
          "kitty poundie",
          "pink bow poundie",
          "3d poundie",
          "sunglasses poundie",
          "beanie poundie",
          "bowtie poundie",
          "kissie poundie",
          "bandit poundie",
          "disguise poundie",
          "beard poundie",
          "tongue out poundie"
        ],
        "background": [],
        "icon": [
          {
            "image_url": "https://powerups.s3.amazonaws.com/emoji/1/icon.mdpi.26x26.png",
            "zip_url": "https://powerups.s3.amazonaws.com/emoji/1/icon.mdpi.26x26.zip",
            "density": 160,
            "x": 26,
            "y": 26
          },
          {
            "image_url": "https://powerups.s3.amazonaws.com/emoji/1/icon.hdpi.39x39.png",
            "zip_url": "https://powerups.s3.amazonaws.com/emoji/1/icon.hdpi.39x39.zip",
            "density": 240,
            "x": 39,
            "y": 39
          },
          {
            "image_url": "https://powerups.s3.amazonaws.com/emoji/1/icon.xhdpi.52x52.png",
            "zip_url": "https://powerups.s3.amazonaws.com/emoji/1/icon.xhdpi.52x52.zip",
            "density": 320,
            "x": 52,
            "y": 52
          },
          {
            "image_url": "https://powerups.s3.amazonaws.com/emoji/1/icon.xxhdpi.78x78.png",
            "zip_url": "https://powerups.s3.amazonaws.com/emoji/1/icon.xxhdpi.78x78.zip",
            "density": 480,
            "x": 78,
            "y": 78
          },
          {
            "image_url": "https://powerups.s3.amazonaws.com/emoji/1/icon.xxxhdpi.104x104.png",
            "zip_url": "https://powerups.s3.amazonaws.com/emoji/1/icon.xxxhdpi.104x104.zip",
            "density": 640,
            "x": 104,
            "y": 104
          }
        ],
        "inline": [
          {
            "image_url": "https://powerups.s3.amazonaws.com/emoji/1/inline.mdpi.20x20.png",
            "zip_url": "https://powerups.s3.amazonaws.com/emoji/1/inline.mdpi.20x20.zip",
            "density": 160,
            "x": 20,
            "y": 20
          },
          {
            "image_url": "https://powerups.s3.amazonaws.com/emoji/1/inline.hdpi.30x30.png",
            "zip_url": "https://powerups.s3.amazonaws.com/emoji/1/inline.hdpi.30x30.zip",
            "density": 240,
            "x": 30,
            "y": 30
          },
          {
            "image_url": "https://powerups.s3.amazonaws.com/emoji/1/inline.xhdpi.40x40.png",
            "zip_url": "https://powerups.s3.amazonaws.com/emoji/1/inline.xhdpi.40x40.zip",
            "density": 320,
            "x": 40,
            "y": 40
          },
          {
            "image_url": "https://powerups.s3.amazonaws.com/emoji/1/inline.xxhdpi.60x60.png",
            "zip_url": "https://powerups.s3.amazonaws.com/emoji/1/inline.xxhdpi.60x60.zip",
            "density": 480,
            "x": 60,
            "y": 60
          },
          {
            "image_url": "https://powerups.s3.amazonaws.com/emoji/1/inline.xxxhdpi.80x80.png",
            "zip_url": "https://powerups.s3.amazonaws.com/emoji/1/inline.xxxhdpi.80x80.zip",
            "density": 640,
            "x": 80,
            "y": 80
          }
        ],
        "outline": [
          {
            "folder_url": "https://powerups.s3.amazonaws.com/emoji/1/outline/mdpi/",
            "density": 160,
            "x": 60,
            "y": 60
          },
          {
            "folder_url": "https://powerups.s3.amazonaws.com/emoji/1/outline/hdpi/",
            "density": 240,
            "x": 90,
            "y": 90
          },
          {
            "folder_url": "https://powerups.s3.amazonaws.com/emoji/1/outline/xhdpi/",
            "density": 320,
            "x": 120,
            "y": 120
          },
          {
            "folder_url": "https://powerups.s3.amazonaws.com/emoji/1/outline/xxhdpi/",
            "density": 480,
            "x": 180,
            "y": 180
          },
          {
            "folder_url": "https://powerups.s3.amazonaws.com/emoji/1/outline/xxxhdpi/",
            "density": 640,
            "x": 240,
            "y": 240
          }
        ],
        "keyboard": [
          {
            "image_url": "https://powerups.s3.amazonaws.com/emoji/1/keyboard.mdpi.40x40.png",
            "zip_url": "https://powerups.s3.amazonaws.com/emoji/1/keyboard.mdpi.40x40.zip",
            "density": 160,
            "x": 40,
            "y": 40
          },
          {
            "image_url": "https://powerups.s3.amazonaws.com/emoji/1/keyboard.hdpi.60x60.png",
            "zip_url": "https://powerups.s3.amazonaws.com/emoji/1/keyboard.hdpi.60x60.zip",
            "density": 240,
            "x": 60,
            "y": 60
          },
          {
            "image_url": "https://powerups.s3.amazonaws.com/emoji/1/keyboard.xhdpi.80x80.png",
            "zip_url": "https://powerups.s3.amazonaws.com/emoji/1/keyboard.xhdpi.80x80.zip",
            "density": 320,
            "x": 80,
            "y": 80
          },
          {
            "image_url": "https://powerups.s3.amazonaws.com/emoji/1/keyboard.xxhdpi.120x120.png",
            "zip_url": "https://powerups.s3.amazonaws.com/emoji/1/keyboard.xxhdpi.120x120.zip",
            "density": 480,
            "x": 120,
            "y": 120
          },
          {
            "image_url": "https://powerups.s3.amazonaws.com/emoji/1/keyboard.xxxhdpi.160x160.png",
            "zip_url": "https://powerups.s3.amazonaws.com/emoji/1/keyboard.xxxhdpi.160x160.zip",
            "density": 640,
            "x": 160,
            "y": 160
          }
        ],
        "sticker": [
          {
            "folder_url": "https://powerups.s3.amazonaws.com/emoji/1/sticker/mdpi/",
            "zip_url": "https://powerups.s3.amazonaws.com/emoji/1/sticker.mdpi.60x60.zip",
            "density": 160,
            "x": 60,
            "y": 60
          },
          {
            "folder_url": "https://powerups.s3.amazonaws.com/emoji/1/sticker/hdpi/",
            "zip_url": "https://powerups.s3.amazonaws.com/emoji/1/sticker.hdpi.90x90.zip",
            "density": 240,
            "x": 90,
            "y": 90
          },
          {
            "folder_url": "https://powerups.s3.amazonaws.com/emoji/1/sticker/xhdpi/",
            "zip_url": "https://powerups.s3.amazonaws.com/emoji/1/sticker.xhdpi.120x120.zip",
            "density": 320,
            "x": 120,
            "y": 120
          },
          {
            "folder_url": "https://powerups.s3.amazonaws.com/emoji/1/sticker/xxhdpi/",
            "zip_url": "https://powerups.s3.amazonaws.com/emoji/1/sticker.xxhdpi.180x180.zip",
            "density": 480,
            "x": 180,
            "y": 180
          },
          {
            "folder_url": "https://powerups.s3.amazonaws.com/emoji/1/sticker/xxxhdpi/",
            "zip_url": "https://powerups.s3.amazonaws.com/emoji/1/sticker.xxxhdpi.240x240.zip",
            "density": 640,
            "x": 240,
            "y": 240
          }
        ]
      }
    }
  ],
  "categories": [
    {
      "id": "emoji-featured",
      "name": "Featured",
      "description": "Featured emoji packs",
      "updated_at": 1507081416,
      "powerups": [
        "emoji-marchmadness",
        "emoji-adventuretime"
      ]
    },
    null,
    null
  ]
}

```

It looks like each powerup in the `powerups` array corresponds to a category. Note that the index of a given powerup is NOT necessarily the ID you should
send in the attachment. Instead, look for `powerup[index].meta.pack_id` for the Pack ID.

`icon` is an array of the pack icons (shown in the tabs in the emoji picker), `inline` and `keyboard` (not sure of the difference between the two, other than the keyboard
emojis being a little larger) both contain the
full set of images for the pack (`image_url` gives you a super long sprite sheet of all of them, whereas `zip_url` gives you a zip file with 0.png, 1.png, 2.png etc.
Each entry contains a `density` value, which gives you the intended screen DPI the emoji should be used on. Also, the `transliterations` array contains short text
descriptions of each emoji--useful for search keywords or when you're displaying the message text somewhere you can't insert inline images (such as in a notification).

Note that some of the higher-DPI `image_url`s are giving me Access Denied errors. I'm not sure why.


## Sending emoji

There isn't really anything special to sending emojis--just craft a message whose `text` contains a placeholder character and create an attachment
in the same format as above.

If you'd like some example code to work off of, here's a short proof-of-concept I made that lets me send custom emojis:

```js
(async () => {
  const rawResponse = await fetch('https://api.groupme.com/v3/groups/YOUR_GROUP_NAME/messages?token=YOUR_API_TOKEN', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({"message":{source_guid: "c9eef281-3bd5-4da6-b8d3-31ac1d63ad45", attachments: [{"charmap": [[2,1],[2,2],[2,3]], "placeholder": "�", "type": "emoji"}], "text": "Hello, this is an emoji test! 1:�, 2:�, 3:�"}})
  });
  const content = await rawResponse.json();

  console.log(content);
})();
```

Note that in my experience it doesn't seem to matter what the placeholder is, as long as you keep it consistent with the message.
