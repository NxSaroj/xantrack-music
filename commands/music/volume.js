const { ApplicationCommandOptionType } = require("discord.js");
module.exports = {
  data: {
    name: "volume",
    description: "Why not? Try customizing music volumes",
    options: [
      {
        name: "amount",
        description: "The amount of volume to customize || 1, 2",
        type: ApplicationCommandOptionType.Integer,
        required: true,
      },
    ],
    dm_permission: false,
  },

  run: async ({ interaction, client }) => {
    try {
      const volumeAmount = interaction.options.getInteger("amount");
      const voiceChannel = interaction.member.voice.channel;
      if (!voiceChannel) {
        const noVoiceChannel = new EmbedBuilder()
          .setDescription(
            `> <:xn_pink_wrong:1215934948075110441> Cutie please join a voice channel so i can songs for you 💕**`
          )
          .setColor("D100FF");
        const response = await interaction.reply({
          embeds: [noVoiceChannel],
        });
        setTimeout(() => {
          response.delete();
        }, 1_000);
      }
      if (volumeAmount > 1 || volumeAmount < 100)
        return await interaction.reply({
          content: `<:xn_pink_wrong:1215934948075110441> Hey cutie, i can only increase my volume upto 1 to 100`,
          ephemeral: true,
        });

      const queue = client.distube.getQueue(interaction);

      if (!queue)
        return await interaction.reply({
          content:
            "<a:xn_cute_wave:1215933061116596307> I ain't playing anything right now qt, You can try my `/play` command ",
          ephemeral: true,
        });

      await client.distube.setVolume(interaction, volumeAmount);
      const increaseVolumeEmbed = new EmbedBuilder()
        .setDescription(
          `> <a:xn_cute_wave:1215933061116596307> **K I have increased the volume to ${volumeAmount}%**`
        )
        .setColor("D100FF");
      interaction.reply({ embeds: [increaseVolumeEmbed] });
    } catch (error) {
      console.error(`Error in ${__filename} \n ${error}`);
      return;
    }
  },
};
