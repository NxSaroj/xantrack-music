const { Events, EmbedBuilder,  Client } = require("discord.js");
module.exports = {
  name: Events.InteractionCreate,
  once: false,
  /**
   * 
   * @param {import('discord.js').Interaction} interaction 
   * @param {Client} client 
   * @returns 
   */
  execute: async (interaction, client) => {
    if (!interaction.isButton()) return; 
    if (interaction.customId == "loop") {
      const queue = client.distube.getQueue(interaction);
      const voiceChannel = interaction.member.voice.channel;
  
      if (!voiceChannel) {
        const noVoiceChannel = new EmbedBuilder()
          .setDescription(
            `> <:xn_pink_wrong:1215934948075110441> Cutie please join a voice channel so i can songs for you 💕**`
          )
          .setColor("D100FF");
        await interaction
          .reply({
            embeds: [noVoiceChannel],
            ephemeral: true,
          })
          .catch((e) => {
            return console.error(e);
          });
        return;
      }
  
      if (!queue) {
        const noQueue = new EmbedBuilder()
          .setDescription(
            "> <:xn_pink_wrong:1215934948075110441> I am not singing anything right now, but i can just use my `/play` command💕**"
          )
          .setColor("D100FF");
        await interaction
          .reply({
            embeds: [noQueue],
            ephemeral: true,
          })
          .catch((e) => {
            return console.error(e);
          });
        return;
      }
  
      try {
        const loopEmbed = new EmbedBuilder()
          .setColor("D100FF")
          .setDescription(
            "<a:xn_pink_tick:1215931955737133066> **Will play that music on loop** "
          );
  
        await client.distube.setRepeatMode(interaction);
        const sent = await interaction
          .reply({
            embeds: [loopEmbed],
          })
          .catch((e) => {
            console.error(e);
          });
        setTimeout(async () => {
          await sent.delete();
        }, 2000);
      } catch (e) {
        const errorEmbed = new EmbedBuilder()
          .setDescription(
            `> <:xn_pink_wrong:1215934948075110441> **Oops! Looks like an error camed, cutie can you try again later**<a:xn_pink_hearts:1215934746316767352>`
          )
          .setColor("D100FF");
        await interaction.reply({
          embeds: [errorEmbed],
          ephemeral: true,
        });
        return;
      }
    }
   
  },
};
