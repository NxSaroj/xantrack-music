const { EmbedBuilder } = require("discord.js");
module.exports = {
  data: {
    name: "stop",
    description: "I will stop the music you dont like",
    dm_permission: false,
  },
  run: async ({ interaction }) => {
    const voiceChannel = interaction.member.voice.channel;

    try {
      if (!voiceChannel) {
        const noVoiceChannel = new EmbedBuilder()
          .setDescription(
            `> <:xn_pink_wrong:1215934948075110441> Cutie please join a voice channel so i can songs for you 💕**`
          )
          .setColor("D100FF");
        const response = await interaction.reply({
          embeds: [noVoiceChannel],
        });
        setTimeout(async () => {
          await response
            .delete()
            .catch((e) =>
              console.error(`Error while deleting the message \n ${e}`)
            );
        }, 2000);
        return;
      }
    } catch (e) {
      return console.error(e)
    }

    try {
      await client.distube.stop(interaction);
      const resumeMusic = new EmbedBuilder()
        .setDescription(
          "> <a:xn_pink_tick:1215931955737133066> **Your orders my commands, Everything for you, Just stopped the music**"
        )
        .setColor("D100FF");
      const response = await interaction.reply({
        embeds: [resumeMusic],
      });
      setTimeout(async () => {
        await response.delete();
      }, 2000);
    } catch (e) {
      await interaction.reply({
        content:
          "<:xn_pink_wrong:1215934948075110441> **Cutie the queue is alredy stopped**",
        ephemeral: true,
      });
    }
  },
};
