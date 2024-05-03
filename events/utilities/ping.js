const { Events } = require("discord.js");
module.exports = {
  name: Events.MessageCreate,
  once: false,
  execute: async (message, client) => {
    try {
      if (message.content.startsWith(`<@${client.user.id}> ping`)) {
        const response = await message.reply({
          content:
            "<a:xn_cute_wave:1215933061116596307> Fetching my heartbeat for you..",
          fetchReply: true,
        });
        const clientPing = client.ws.ping;
        try {
          response.edit({
            content: `**Here's my heartbeat \n HeartBeat <a:xn_pink_arrow:1215929366547005450> ${clientPing}ms \n RoundTrip <a:xn_pink_arrow:1215929366547005450> ${
              response.createdTimestamp - message.createdTimestamp
            }ms**`,
          });
        } catch (e) {
          response.edit({
            content: `<:xn_pink_sad:1215937261485559819> **An Error camed in my heartbeat**`,
          });
          console.error(e);
          return;
        }
      }
    } catch (e) {
      return console.error(`Error in ${__filename} \n ${e}`);
    }
  },
};
