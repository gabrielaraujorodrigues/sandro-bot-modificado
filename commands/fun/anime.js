const fetch = require('node-fetch');
module.exports = {
  name: 'anime', aliases: ['anime2', 'buscaanime'],
  description: 'Busca informações de um anime (ex: /anime Naruto)',
  async execute(sock, { from, args }) {
    if (!args.length) return sock.sendMessage(from, { text: '❌ Informe o nome do anime. Ex: /anime Naruto' });
    const q = args.join(' ');
    try {
      const res = await fetch(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(q)}&limit=1`);
      const data = await res.json();
      const anime = data.data?.[0];
      if (!anime) return sock.sendMessage(from, { text: '❌ Anime não encontrado.' });
      const txt = `🎌 *${anime.title}*\n\n📺 Episódios: ${anime.episodes || '?'}\n⭐ Nota: ${anime.score || '?'}/10\n📅 Status: ${anime.status}\n🗓️ Ano: ${anime.aired?.prop?.from?.year || '?'}\n🏷️ Gêneros: ${anime.genres?.map(g => g.name).join(', ')}\n\n📝 ${anime.synopsis?.slice(0, 200) || 'Sem sinopse'}...`;
      if (anime.images?.jpg?.large_image_url) {
        const imgRes = await fetch(anime.images.jpg.large_image_url);
        const buffer = Buffer.from(await imgRes.arrayBuffer());
        await sock.sendMessage(from, { image: buffer, caption: txt });
      } else {
        await sock.sendMessage(from, { text: txt });
      }
    } catch (e) {
      await sock.sendMessage(from, { text: '❌ Erro ao buscar anime: ' + e.message });
    }
  },
};
