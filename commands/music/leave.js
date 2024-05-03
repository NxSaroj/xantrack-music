const { joinVoiceChannel } = require("@discordjs/voice");
const { EmbedBuilder } = require("discord.js");
module.exports = {
  data: {
    name: "leave",
    description: "I will leave the voice channel for you",
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

    const connection = joinVoiceChannel({
      channelId: interaction.member.voice.channelId,
      guildId: interaction.guildId,
      adapterCreator: interaction.guild.voiceAdapterCreator,
    });

    try {
      connection.destroy();
      const leave = new EmbedBuilder()
        .setDescription(
          `><a:xn_cute_wave:1215933061116596307> **K I Leaved the voice channel**`
        )
        .setColor("D100FF");
      await interaction.reply({
        embeds: [leave],
      });
    } catch (e) {
      return console.error(e);
    }
  },
};
