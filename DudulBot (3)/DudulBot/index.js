const keepAlive = require('./server.js');
keepAlive();

const fs = require('fs');
const chismesData = require('./chismes.json');
let chismes = chismesData.chismes;

const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.once('ready', async () => {
  console.log(`¡El bot está activo como ${client.user.tag}!`);

  const guild = client.guilds.cache.get(process.env.GUILD_ID);
  if (guild) {
    try {
      const botMember = await guild.members.fetch(client.user.id);
      await botMember.setNickname('Doña Mary');
      console.log("Apodo cambiado a Doña Mary");
    } catch (error) {
      console.error("No se pudo cambiar el apodo:", error);
    }
  }

  setInterval(() => {
    const channel = client.channels.cache.get(process.env.CHANNEL_ID);
    if (channel) {
      const chisme = chismes[Math.floor(Math.random() * chismes.length)];
      channel.send(chisme);
    }
  }, 7200000);
});

client.on('messageCreate', message => {
  if (message.author.bot) return;

  if (message.content === '!chisme') {
    const chisme = chismes[Math.floor(Math.random() * chismes.length)];
    message.channel.send(chisme);
  }

  if (message.content.startsWith('!addchisme ')) {
    if (!message.member.roles.cache.some(role => role.name === 'Cajero')) {
      return message.reply("No tienes permisos para agregar chismes.");
    }

    const nuevoChisme = message.content.replace('!addchisme ', '').trim();
    chismes.push(nuevoChisme);
    chismesData.chismes = chismes;
    fs.writeFileSync('./chismes.json', JSON.stringify(chismesData, null, 2));
    message.channel.send(`Nuevo chisme agregado: "${nuevoChisme}"`);
  }
});

client.login(process.env.TOKEN);








