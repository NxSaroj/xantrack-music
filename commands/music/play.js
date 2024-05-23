const { ApplicationCommandOptionType, EmbedBuilder } = require("discord.js");

module.exports = {
  data: {
    name: "play",
    description: "I will play your favourite songs",
    dm_permission: false,
    options: [
      {
        name: "song-name",
        description: "Enter the song name or url",
        type: ApplicationCommandOptionType.String,
        required: true,
      },
    ],
  },
  run: async ({ interaction, client }) => {
    const song = interaction.options.getString("song-name");
    const voiceChannel = interaction.member.voice.channel;

    if (!voiceChannel) {
      const noVoiceChannel = new EmbedBuilder()
        .setDescription(
          `> <:xn_pink_wrong:1215934948075110441> Cutie please join a voice channel so i can songs for you 💕**`
        )
        .setColor("D100FF");
      const response = await interaction
        .reply({
          embeds: [noVoiceChannel],
        })
        .catch((err) => {
          return;
        });
      setTimeout(async () => {
        await response
          .delete()
          .catch((e) =>
            console.error(`Error while deleting the message \n ${e}`)
          );
      }, 2000);
    }

    const response = await interaction.reply(
      `<a:xn_pink_loading:1215940417078693918> Finding the song...`
    );

    try {
      await client.distube.play(voiceChannel, song, {
        textChannel: interaction.channel,
        member: interaction.member,
      });

      await response.edit(
        `<a:xn_pink_tick:1215931955737133066> **YAY Now i will sing the song for you**`
      );
    } catch (e) {
      console.error(`Error in ${__filename} \n ${e}`);
      return;
    }
  },
};
