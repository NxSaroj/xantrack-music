const { ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js')

const pauseButton = new ButtonBuilder()
.setCustomId('pause')
.setEmoji('1216006315516756090')
.setStyle(ButtonStyle.Danger)

const resumeButton = new ButtonBuilder()
.setCustomId('resume')
.setEmoji('1216006312304050327')
.setStyle(ButtonStyle.Danger)

const loopButton = new ButtonBuilder()
.setCustomId('loop')
.setEmoji('1216006309493866576')
.setStyle(ButtonStyle.Danger)

const buttonsRow = new ActionRowBuilder()
.addComponents(
    pauseButton,
    resumeButton,
    loopButton
)

module.exports = buttonsRow;