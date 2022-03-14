const { Client, Intents, DMChannel } = require('discord.js')
const cowsay = require('cowsay')

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.DIRECT_MESSAGES,
  ],
})

client.login(process.env.BOT_TOKEN)

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`)
})

const noGmAllowed = /^(gn|gm)(\s+|$)/i
const secretChannel = /^!join$/
const noCommands = /^!/
const verifyCommand = /^!verify/
const noChannelTags = /^\s*\<#\d+\>\s*$/

// auto-replies
const wenToken = /.*wh?en .*(token|airdrop|drop|claim).*/i
const whereToken = /.*where (to |.*)(claim|airdrop).*/i
const howToClaim = /.*(how) (.*)(claim|airdrop).*/i
const whenTrade = /.*(wh?en|how|where) .*(trade|exchange|swap|sell|listing).*/i
const isTradeable = /.*(is|can) (trade(able)?|list(ed)?).*/i
const whenGovernance = /a/i
const sellToken = /.*(where|how|wh?en).*(sell).*/i
const tokenPrice = /.*(what)?.*(token)? price.*/i
const wenMoon = /.*(wh?en|where).*mo+n.*/i
const wenLambo = /.*(wh?en|where).*lambo.*/i
const contractAddress = /.*contract .*address.*/i
const totalSupply = /.*(total|max|maximum|token) supply.*/i
const addGChain = /.*add (gchain|gnosis ?chain|xdai)( to (mm|metamask|mmask|wallet))?.*/i

const wenMoonGifs = [
  'https://cdn.discordapp.com/attachments/941725405554024539/942843922483413042/ezgif.com-gif-maker_78.gif',
  'https://cdn.discordapp.com/attachments/869170255266734103/941755575073660959/44aafe91f10b22af690ccb7513d03779.gif',
  'https://c.tenor.com/YZWhYF-xV4kAAAAd/when-moon-admin.gif',
  'https://c.tenor.com/x-kqDAmw2NQAAAAC/parrot-party.gif',
  'https://cdn.discordapp.com/attachments/941725405554024539/941764782711767120/ezgif.com-gif-maker_72.gif',
  'https://c.tenor.com/R6Zf7aUegagAAAAd/lambo.gif',
]

const wenLamboGifs = [
  'https://c.tenor.com/5bScutaRZWgAAAAd/travolta-safemoon.gif',
  'https://c.tenor.com/_dae-kRV6jUAAAAS/lambo-cardboard.gif',
  'https://c.tenor.com/R6Zf7aUegagAAAAd/lambo.gif',
  'https://cdn.discordapp.com/attachments/941725405554024539/941768562509500446/ezgif.com-gif-maker_73.gif',
]

function pickFromList(list) {
  let count = -1
  return () => {
    count += 1
    if (count > list.length - 1) {
      count = 0
    }
    return list[count]
  }
}

const pickMoon = pickFromList(wenMoonGifs)
const pickLambo = pickFromList(wenLamboGifs)

function codeBlock(message) {
  return '```' + message + '```'
}

client.on('messageCreate', async (message) => {
  try {
    if (message.author.bot) {
      console.log('Do not reply to bots', message.author.tag)
      return
    }
    if (message.type !== 'DEFAULT') {
      console.log('Can only interact with default messages', message.type)
      return
    }
    if (message.channel instanceof DMChannel) {
      message.reply(
        codeBlock(cowsay.say({ text: "I am a bot and can't reply, beep bop" })),
      )
      return
    }

    if (verifyCommand.test(message.content)) {
      await message.reply('You are close, buddy. Try `/verify` instead')
      await message.delete()
    } else if (noCommands.test(message.content)) {
      await message.reply(
        'Not a valid command. Maybe try `/verify` on #verify-here ?',
      )

      if (secretChannel.test(message.content)) {
        const dmChannel = await message.author.createDM()
        await dmChannel.send(
          codeBlock(cowsay.say({ text: 'There is no #cow-level 🤫', p: true })),
        )
      }
      await message.delete()
    } else if (noChannelTags.test(message.content)) {
      await message.reply('Please stop tagging channels with no reason')
      await message.delete()
    } else if (noGmAllowed.test(message.content)) {
      await message.reply(
        'Please mooooove your `gm` and `gn` to the #gm channel',
      )
      await message.delete()
    } else if (whereToken.test(message.content)) {
      await message.reply('https://cowswap.exchange/#/claim')
    } else if (howToClaim.test(message.content)) {
      await message.reply(
        'Follow the instructions on https://medium.com/@cow-protocol/step-by-step-guide-for-claiming-vcow-in-gnosis-chain-b1a1442a3454',
      )
    } else if (
      whenTrade.test(message.content) ||
      sellToken.test(message.content) ||
      isTradeable.test(message.content)
    ) {
      await message.reply(
        'vCOW is a non-transferable governance token. CowDAO might vote to make it swapable via governance vote.\nWen? After airdrop is complete\nWen? 6 weeks after initial deployment\nWen? Aprox. March 25th',
      )
    } else if (tokenPrice.test(message.content)) {
      await message.reply(
        'The price for investing is 0.15 USD per vCOW. The equivalent in GNO, ETH and xDAI (according to what option you have, if any) was defined at the proposal creation time.\nSee https://forum.gnosis.io/t/gip-13-phase-2-cowdao-and-cow-token/2735 or Pinned messages on #general for more details',
      )
    } else if (wenMoon.test(message.content)) {
      await message.reply(pickMoon())
    } else if (wenLambo.test(message.content)) {
      await message.reply(pickLambo())
    } else if (wenToken.test(message.content)) {
      await message.reply("vCOW is a non-transferable governance token. CowDAO might vote to make it swapable via governance vote.\nWen? After airdrop is complete\nWen? 6 weeks after initial deployment\nWen? Aprox. March 25th")
    } else if (contractAddress.test(message.content)) {
      await message.reply(
        'vCOW contract addresses:\n-Mainnet: https://etherscan.io/address/0xd057b63f5e69cf1b929b356b579cba08d7688048\n-Gnosis Chain: https://blockscout.com/xdai/mainnet/token/0xc20C9C13E853fc64d054b73fF21d3636B2d97eaB',
      )
    } else if (totalSupply.test(message.content)) {
      await message.reply(
        "vCOW's total supply is 1 Billion.\n\nKeep in mind not everything will be in circulation because most will have a 4 year vesting period. For more info, check https://forum.gnosis.io/t/gip-13-phase-2-cowdao-and-cow-token/2735",
      )
    } else if (addGChain.test(message.content)) {
      await message.reply(
        'To add Gnosis Chain to your wallet:\n1. go to https://chainlist.org/\n2. Search for Gnosis Chain\n3. Connect your wallet\n4. Click on "Add to Metamask"',
      )
    }
  } catch (e) {
    console.error('Something failed handling a message', e)
  }
})
