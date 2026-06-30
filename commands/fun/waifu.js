const fetch = require('node-fetch');

module.exports = {
  name: 'waifu',
  aliases: ['anime', 'animes'],
  description: 'Envia uma imagem aleatória de anime/waifu',
  async execute(sock, { from }) {
    try {
      const categorias = ['waifu', 'maid', 'marin-kitagawa', 'mori-calliope', 'raiden-shogun', 'oppai', 'selfies', 'uniform'];
      const cat = categorias[Math.floor(Math.random() * categorias.length)];
      const res = await fetch(`https://api.waifu.im/search?included_tags=${cat}&is_nsfw=false`);
      const data = await res.json();
      const url = data.images?.[0]?.url;
      if (!url) throw new Error('sem url');
      const imgRes = await fetch(url);
      const buffer = Buffer.from(await imgRes.arrayBuffer());
      await sock.sendMessage(from, { image: buffer, caption: `🎌 *Waifu aleatória*` });
    } catch {
      await sock.sendMessage(from, { text: '❌ Erro ao buscar waifu. Tente novamente!' });
    }
  },
};
