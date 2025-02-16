const { Client, GatewayIntentBits } = require("discord.js");
require("dotenv").config();

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

client.on("messageCreate", (message) => {
    if (message.content.startsWith("!chisme")) {
        message.channel.send("Aquí viene el chisme 🍵...");
    }
});

function iniciarChismeBot() {
    client.login(process.env.TOKEN_CHISME);
}

module.exports = { iniciarChismeBot };
