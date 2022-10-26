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

  // Finds the given block and digs it
  async function digBlock(block) {
    await bot.dig(bot.blockAt(block.position)) // We do this in case the block changed by the time we got there
    bot.chat('I dug up a ' + block.displayName)
  }

  // Travels to a given block. You should `await` this function, to avoid doing anything before you get to that block
  // Throws an error if we cannot find or reach that block
  async function travelToBlock(block) {
    bot.pathfinder.setMovements(defaultMove)
    await bot.pathfinder.goto(new GoalLookAtBlock(block.position, bot.world, {reach: 4}))
    bot.chat("Got to the block!")
    await digBlock(block)
  }

  bot.on('chat', async (username, message) => {
    try {
      if (username === bot.username) return
      if (message === "find wood") {
        const block = findBlock("LOG")
        if (block) {
          console.log(block)
          bot.chat(`I found a block of type ${block.displayName} at location ${JSON.stringify(block.position)}`)
          await travelToBlock(block)
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