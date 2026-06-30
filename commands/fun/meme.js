const fetch = require('node-fetch');
module.exports = {
  name: 'meme', aliases: ['memes'],
  description: 'Envia um meme aleatório',
  async execute(sock, { from }) {
    try {
      const res = await fetch('https://meme-api.com/gimme', { timeout: 8000 });
      const data = await res.json();
      if (!data.url) throw new Error();
      const imgRes = await fetch(data.url, { timeout: 10000 });
      const buffer = Buffer.from(await imgRes.arrayBuffer());
      await sock.sendMessage(from, { image: buffer, caption: `😂 *${data.title || 'Meme do dia'}*` });
    } catch {
      await sock.sendMessage(from, { text: '😂 *Meme do dia:*\n\nVocê quando o WiFi cai no meio de uma partida 😭💀\n\n_Tente novamente para ver uma imagem de meme!_' });
    }
  },
};
