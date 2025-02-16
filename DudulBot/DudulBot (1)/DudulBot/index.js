// Iniciamos el servidor web para que Replit no se duerma
const keepAlive = require('./server.js');
keepAlive();

// Importamos el módulo 'fs' para manejar archivos y cargamos los chismes desde chismes.json
const fs = require('fs');
const chismesData = require('./chismes.json');
// Usamos "let" para que podamos modificar el array en memoria
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

// Cuando el bot esté listo, se activa y se configura el intervalo para enviar chismes automáticos
client.once('ready', async () => {
  console.log(`¡El bot está activo como ${client.user.tag}!`);

  // Cambiar el apodo del bot en el servidor
  const guild = client.guilds.cache.get('1340089654736719882'); // Reemplaza con el ID de tu servidor
  if (guild) {
    try {
      const botMember = await guild.members.fetch(client.user.id);
      await botMember.setNickname('Doña Mary');
      console.log("Apodo cambiado a Doña Mary");
    } catch (error) {
      console.error("No se pudo cambiar el apodo:", error);
    }
  }

  // Envía un chisme cada 2 horas (7200000 milisegundos)
  setInterval(() => {
    const channel = client.channels.cache.get('1340089654736719882'); // Reemplaza con el ID real de tu canal
    if (channel) {
      const chisme = chismes[Math.floor(Math.random() * chismes.length)];
      channel.send(chisme);
    }
  }, 7200000);
});

// Escuchamos todos los mensajes para detectar comandos
client.on('messageCreate', message => {
  // Ignoramos mensajes de otros bots
  if (message.author.bot) return;

  // Comando para mostrar un chisme aleatorio
  if (message.content === '!chisme') {
    const chisme = chismes[Math.floor(Math.random() * chismes.length)];
    message.channel.send(chisme);
  }

  // Comando para agregar un chisme nuevo (solo para usuarios con el rol "Moderador")
  if (message.content.startsWith('!addchisme ')) {
    // Verificamos si el autor tiene el rol "Moderador"
    if (!message.member.roles.cache.some(role => role.name === 'Cajero')) {
      return message.reply("No tienes permisos para agregar chismes.");
    }

    // Extraemos el chisme nuevo: eliminamos el prefijo y los espacios en blanco
    const nuevoChisme = message.content.replace('!addchisme ', '').trim();

    // Agregamos el nuevo chisme al array en memoria
    chismes.push(nuevoChisme);

    // Actualizamos el objeto que se guardará en el archivo JSON
    chismesData.chismes = chismes;

    // Escribimos el nuevo contenido en chismes.json (lo formateamos con 2 espacios de indentación)
    fs.writeFileSync('./chismes.json', JSON.stringify(chismesData, null, 2));

    // Confirmamos al usuario que se ha agregado el nuevo chisme
    message.channel.send(`Nuevo chisme agregado: "${nuevoChisme}"`);
  }
});

client.login(process.env.TOKEN);







