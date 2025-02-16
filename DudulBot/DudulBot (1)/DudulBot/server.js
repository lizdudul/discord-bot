const express = require('express');
const server = express();

// Ruta principal: responde con un mensaje simple
server.get('/', (req, res) => {
  res.send('¡El bot sigue vivo y coleando!');
});

// Ruta para UptimeRobot (opcional, pero puede ayudar)
server.get('/ping', (req, res) => {
  res.send('Pong! El bot está en línea.');
});

// Función para mantener el servidor activo
function keepAlive() {
  const PORT = process.env.PORT || 3000;
  server.listen(PORT, () => {
    console.log(`✅ Servidor web activo en el puerto ${PORT}`);
  });
}

// Exportar la función
module.exports = keepAlive;







