const { EmbedBuilder, Events } = require("discord.js");
const infoButtonRow = require("../../models/buttons/info-buttons");

module.exports = {
  name: Events.MessageCreate,
  once: false,
  execute: async (message, client) => {
    try {
      if (!message.content.startsWith(`<@${client.user.id}> info`)) return;

      const response = await message.channel.send({
        content:
          "<a:xn_pink_loading:1215940417078693918> **Fetching my info for you**",
      });

      const infoEmbed = new EmbedBuilder()
        .setAuthor({
          name: `${client.user.username}`,
          iconURL: client.user.displayAvatarURL({ size: 256 }),
        })
        .setThumbnail(client.user.displayAvatarURL())
        .setDescription(
          `** <a:xn_cute_wave:1215933061116596307> Hi, I'm Sumana, your bestie! I've got super cool music tricks that you're gonna love! 🎶💖 \n\n Name <a:xn_pink_arrow:1215929366547005450> ${client.user.username} \n Ping <a:xn_pink_arrow:1215929366547005450> ${client.ws.ping}ms \n Total Servers <a:xn_pink_arrow:1215929366547005450> ${client.guilds.cache.size} **`
        )
        .setColor("D100FF");

      try {
        await response.edit({
            content: "",
            embeds: [infoEmbed],
            components: [infoButtonRow],
          })
          .catch(async (e) => {
            await response.edit({
              content: "<:xn_pink_wrong:1215934948075110441> *Oops! It seems there's a little hiccup. Please try again later, sweetie!<a:xn_pink_hearts:1215934746316767352>**"
            })
            console.error(e)
            return;
          });
        return;
      } catch (e) {
        console.error(`Error in ${__filename} \n ${e}`);
        response.edit({
          content:
            "<:xn_pink_wrong:1215934948075110441> *Oops! It seems there's a little hiccup. Please try again later, sweetie!<a:xn_pink_hearts:1215934746316767352>**",
        });
        return;
      }
    } catch (e) {
      console.error(`Error in ${__filename} \n ${e}`);
    }
  },
};
