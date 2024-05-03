const { Client, GatewayIntentBits, EmbedBuilder } = require("discord.js");
const { CommandKit } = require("commandkit");
const { SpotifyPlugin } = require("@distube/spotify");
const { YtDlpPlugin } = require("@distube/yt-dlp");
const { DisTube } = require("distube");

const dotenv = require("dotenv");
const buttonsRow = require('./models/buttons/music-buttons')
const path = require("node:path");
const fs = require("node:fs").promises;


dotenv.config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates,
  ],
});

client.distube = new DisTube(client, {
  leaveOnStop: false,
  emitNewSongOnly: true,
  emitAddSongWhenCreatingQueue: false,
  emitAddListWhenCreatingQueue: false,
  plugins: [
    new SpotifyPlugin({
      emitEventsAfterFetching: true,
    }),
    new YtDlpPlugin(),
  ],
});

const status = (queue) => {
  `Volume: \`${queue.volume}%\` | Filter: \`${
    queue.filters.names.join(", ") || "Off"
  }\` | Loop: \`${
    queue.repeatMode
      ? queue.repeatMode === 2
        ? "All Queue"
        : "This Song"
      : "Off"
  }\` | Autoplay: \`${queue.autoplay ? "On" : "Off"}\``;
};

new CommandKit({
  client: client,
  commandsPath: path.join(__dirname, "commands"),
  bulkRegister: true,
});

const loadEvents = async (client, directory = 'events') => {
    const eventsPath = path.join(__dirname, directory);
  
    try {
      const files = await fs.readdir(eventsPath);
  
      for (const file of files) {
        const filePath = path.join(eventsPath, file);
        const stat = await fs.stat(filePath);
  
        if (stat.isDirectory()) {
          await loadEvents(client, path.join(directory, file));
        } else if (file.endsWith('.js')) {
          const { execute, name, once } = require(filePath);
  
          const eventHandler = (...args) => execute(...args, client);
  
          if (once) {
            client.once(name, eventHandler);
          } else {
            client.on(name, eventHandler);
          }
        }
      }
  
      console.log(`Events loaded successfully.`);
    } catch (error) {
      console.error(`Error loading events in '${directory}':`, error);
    }
  };

  loadEvents(client)

let playMessage;
try {
  client.distube
    .on("playSong", (queue, song) => {
      const embed = new EmbedBuilder()
        .setColor('D100FF')
        .setAuthor({
          name: "Groove Session",
          iconURL:
            "https://cdn.dribbble.com/users/1237300/screenshots/6478927/__-1_1_____.gif",
        })
        .setThumbnail(song.thumbnail)
        .setDescription(
          `**The Party Starts Now, Below are the details of the song** \n\n **Name <a:xn_pink_arrow:1215929366547005450> [${song.name}](${song.url})\n **Duration** <a:xn_pink_arrow:1215929366547005450> ${song.formattedDuration.toString()} \n Hears <a:xn_pink_arrow:1215929366547005450> ${song.views.toString()}**`
        )
        .setFooter({
          text: `Requested by ${song.user.username}`,
          iconURL: song.user.displayAvatarURL({ size: 256 }),
        });

      playMessage = queue.textChannel.send({
        embeds: [embed],
        components: [buttonsRow]
      });
    })
    .on("addList", (queue, song) => {
      const embed = new EmbedBuilder()
        .setDescription(
          `> <a:xn_pink_tick:1215931955737133066>**Added Playlist ${
            song.name
          } ${song.formattedDuration} to ${status(queue)}**`
        )
        .setColor('D100FF');

      queue.textChannel.send({
        embeds: [embed],
      });

      try {
        if (playMessage) {
          playMessage
            .then((msg) => msg.delete())
            .catch((e) => console.error(e));
        }
      } catch (e) {
        console.error(e);
      }
      
    })
    .on("addSong", (queue, song) => {
      const embed = new EmbedBuilder()
        .setTitle("<:xn_arrow:1207610123778920448> Added Song to queue")
        .setDescription(
          `\`${song.name}\` - \`${song.formattedDuration}\` - Requested by ${song.user}`
        )
        .setColor('D100FF');

      queue.textChannel.send({ embeds: [embed] });
    })
    .on("error", (textChannel, e) => {
      console.error(e);
      const embed = new EmbedBuilder()
        .setDescription(
          `> <:xn_pink_wrong:1215934948075110441> *Oops! It seems there's a little hiccup. Please try again later, sweetie!<a:xn_pink_hearts:1215934746316767352>`
        )
        .setColor('D100FF');
      textChannel.send({
        embeds: [embed],
      });
    })
    .on("empty", (queue) => {
      const embed = new EmbedBuilder()
        .setDescription(
          "> <a:xn_cute_wave:1215933061116596307> Oh no, everyone left. I guess it's my turn to go too. 🌸 Gotta switch on my 24/7 mode with /24.7 and keep the cuteness going! <a:xn_pink_hearts:1215934746316767352>"
        )
        .setColor('D100FF');

      try {
        if (playMessage) {
          playMessage
            .then((msg) => msg.delete())
            .catch((e) => console.error(e));
        }
      } catch (e) {
        console.error(e);
      }
      queue.textChannel.send({ embeds: [embed] });
    })
    .on("finish", (queue) => {
      const embed = new EmbedBuilder()
        .setColor("White")
        .setDescription(
          `> <a:xn_pink_ok:1215935755118186637> Yay! Just finished playing ${queue.songs[0].name} with a sprinkle of cuteness! <:xn_pink_music:1215936231012040774>`
        );

      try {
        if (playMessage) {
          playMessage
            .then((msg) => msg.delete())
            .catch((e) => console.error(e));
        }
      } catch (e) {
        console.error(e);
      }

      queue.textChannel.send({ embeds: [embed] });
    })
    .on("disconnect", (queue) => {
      const embed = new EmbedBuilder()
      .setColor('D100FF')
        .setDescription("**<a:xn_pink_ok:1215935755118186637> Oopsie! Disconnected from the voice channel. Catch you later! 💕👋**");

     let disconnectMessage =  queue.textChannel.send({ embeds: [embed] });

     try {
      if (disconnectMessage) {
        setTimeout(() => {
          disconnectMessage.then((msg)=>msg.delete()).catch(e => console.error(e))
        }, 3000);
      }
     } catch (e) {

     }

      try {
        if (playMessage) {
          playMessage
            .then((msg) => msg.delete())
            .catch((e) => console.error(e));
        }
      } catch (e) {
        console.error(e);
      }
    })
    .on("searchNoResult", (message, query) => {
      const noResult = new EmbedBuilder()
        .setDescription(
          `> <:xn_pink_sad:1215937261485559819>
          Oh no! No query found with the result, sweetie. Don't worry, we'll find it together next time! 🌸💕`
        )
        .setColor('D100FF');

      message.channel.send({
        embeds: [noResult],
      });
    });
} catch (e) {
  console.error(e);
}

client.login(process.env.TOKEN).then(()=>{
	console.log(`Connected to bot`)
}).catch((e) => {
  console.error(`Error while connection to bot \n ${e}`)

})
