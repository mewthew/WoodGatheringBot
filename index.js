// New to JavaScript? Check out this intro from Mineflayer:
//  https://github.com/PrismarineJS/mineflayer/blob/master/docs/tutorial.md#javascript-basics

// Full Mineflayer docs: https://mineflayer.prismarine.js.org/#/

const mineflayer = require('mineflayer')

/**
 * @param {mineflayer.Bot} bot - The Mineflayer bot
 */
function configureBot(bot) {

  bot.on('chat', async (username, message) => {
    try {
      if (username === bot.username) return
      bot.chat("This is what I heard in chat: " + message)
    } catch (err) {
      console.log(err)
    }
  })

}

exports.configureBot = configureBot