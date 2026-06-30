const fetch = require('node-fetch');

module.exports = {
  name: 'gato',
  aliases: ['cat', 'gatinho', 'miau'],
  description: 'Envia uma foto aleatória de gato',
  async execute(sock, { from }) {
    try {
      const res = await fetch('https://api.thecatapi.com/v1/images/search');
      const [data] = await res.json();
      const imgRes = await fetch(data.url);
      const buffer = Buffer.from(await imgRes.arrayBuffer());
      await sock.sendMessage(from, { image: buffer, caption: '🐱 *Gatinho aleatório!*' });
    } catch {
      await sock.sendMessage(from, { text: '❌ Erro ao buscar gatinho.' });
    }
  },
};
