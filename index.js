// We import the package that we installed earlier
const SlackBot = require('slackbots');

// We create a new Slack bot using the Token and name from before
const bot = new SlackBot({
  // Replace <SLACK_TOKEN> with the token from step E
  token: process.env.SLACK_TOKEN,
  // Replace <BOT_NAME> with the name from step E
  name: 'WonderValley'
});

// This will be invoked when our bot has connected to Slack
bot.on('start', () => {
  // We will now make the bot post a message to a specific user on startup
  // Replace <USERNAME> with your username
  bot.postMessageToUser(
    // The user we want to send a message to
    'underdal',
    // The message to send
    'I am awsome!'
  );
});

const compliments = [
  'You are fantastic!',
  'You are awesome!',
  'Your smile is contagious!',
  'You are an inspiration!'
];

// The current compliment
let currentCompliment = 0;

bot.on('message', function(data) {
  // We define a RegExp pattern the bot is looking for
  // In this case it is looking for messages of the form "[Cc]omplement @username"
  // The [Cc] means that we accept the message to start with either a large C or a small c.
  const pattern = /[Cc]ompliment <@(\w+)>/
  if (data.text && data.text.match(pattern)) {
    // If the message matches the pattern, the user ID is extracted from the message
    const user = data.text.match(pattern)[1];

    if (user) {
      // The bot gets the user name from the user ID, and attempts to send the user a random complement
      bot.getUserById(user).then(({ name }) => {
        bot.postMessageToUser(name, compliments[currentCompliment]);
        currentCompliment =
          // We increase the current compliment with one
          (currentCompliment + 1 )
          // We are suing modulus here
          // It will make sure we never go outside of the array size
          // This will result in the following pattern with out current array 0, 1, 2, 3, 0, 1, 2, 3, 0, ...
          % compliments.length;
      });
    }
  }
});


