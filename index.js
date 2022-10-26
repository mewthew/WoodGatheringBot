// New to JavaScript? Check out this intro from Mineflayer:
//  https://github.com/PrismarineJS/mineflayer/blob/master/docs/tutorial.md#javascript-basics

// Full Mineflayer docs: https://mineflayer.prismarine.js.org/#/

const mineflayer = require('mineflayer')
const { pathfinder, Movements } = require('mineflayer-pathfinder')
const { GoalNear, GoalBlock, GoalGetToBlock, GoalLookAtBlock, GoalXZ, GoalY, GoalInvert, GoalFollow } = require('mineflayer-pathfinder').goals
const { Vec3 } = require('vec3');

/**
 * @param {mineflayer.Bot} bot - The Mineflayer bot
 */
function configureBot(bot) {

  // Configure the bot to have access to Mineflayer modules/plugins
  bot.loadPlugin(pathfinder)
  const mcData = require('minecraft-data')(bot.version)
  const defaultMove = new Movements(bot, mcData)

  // Finds a block of the given type, within 50 blocks from the bot
  function findBlock(blockType) {
    // Finds the location of the blocks
    bot.chat("Trying to find " + blockType)
    let blockLocations = bot.findBlocks({
      point: bot.entity.position,
      matching: (block) => {
        // Match any block where the given name is included in the block name
        return block.name.toLowerCase().includes(blockType.toLowerCase()) ||
          block.displayName.toLowerCase().includes(blockType.toLowerCase());
      },
      maxDistance: 50,
      count: 1
    })

    bot.chat(JSON.stringify(blockLocations))
    if (blockLocations.length > 0) {
      return bot.blockAt(blockLocations[0])
    }
    return null
  }

  bot.on('chat', async (username, message) => {
    try {
      if (username === bot.username) return
      if (message === "find wood") {
        const block = findBlock("LOG")
        if (block) {
          console.log(block)
          bot.chat(`I found a block of type ${block.displayName} at location ${JSON.stringify(block.position)}`)
        } else {
          bot.chat("I couldn't find that kind of block!")
        }
      }
    } catch (err) {
      console.log(err)
    }
  })
}

exports.configureBot = configureBot