const fetch = require('node-fetch');

module.exports = {
  name: 'cachorro',
  aliases: ['dog', 'doguinho', 'auau'],
  description: 'Envia uma foto aleatória de cachorro',
  async execute(sock, { from }) {
    try {
      const res = await fetch('https://dog.ceo/api/breeds/image/random');
      const data = await res.json();
      const imgRes = await fetch(data.message);
      const buffer = Buffer.from(await imgRes.arrayBuffer());
      await sock.sendMessage(from, { image: buffer, caption: '🐶 *Doguinho aleatório!*' });
    } catch {
      await sock.sendMessage(from, { text: '❌ Erro ao buscar cachorro.' });
    }
  },
};
