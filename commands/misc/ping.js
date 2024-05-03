
module.exports = {
    data: {
        name: 'ping',
        description: 'you can check my heartbeat with this',
        dm_permission: false
    },
    run: async ({ interaction, client }) => {
        const response = await interaction.reply({
            content: '<a:xn_cute_wave:1215933061116596307> Fetching my heartbeat for you..',
            fetchReply: true
        })
        try {
            const clientPing = client.ws.ping
            interaction.editReply({
                content: `**Here's my heartbeat \n HeartBeat <a:xn_pink_arrow:1215929366547005450> ${clientPing}ms \n RoundTrip <a:xn_pink_arrow:1215929366547005450> ${response.createdTimestamp - interaction.createdTimestamp},s**`
            })
            return
        } catch (e) {
            response.edit({
                content: `<:xn_pink_sad:1215937261485559819> **An Error camed in my heartbeat**`
            })
            console.error(e)
            return;
        }
    }
}