const { Events } = require("discord.js");
const { management } = require('../../../config.json')
module.exports = {
  name: Events.MessageCreate,
  once: false,
  /**
   *
   * @param {import('discord.js').Message} message
   * @param {import('discord.js').Client} client
   */
  execute: async (message, client) => {
    if (message.author.id !== management[0].discordId) return message.reply(`<:xn_pink_wrong:1215934948075110441> **Cutie This command is owner only**`)
    const code = message.content.slice(".run".length).trim();
    const reply = await message.channel.send(`Evaluating the code...`);
    const output = eval(code);
    if (eval instanceof Promise) await output;
    await reply.edit(`\`\`\`js\n${output}\n\`\`\``).catch((err) => {
      return reply.edit(`\`\`\`js\n${err}\n\`\`\``);
    });
  },
};
