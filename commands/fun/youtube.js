const fetch = require('node-fetch');

module.exports = {
  name: 'youtube',
  aliases: ['yt', 'video', 'vídeo'],
  description: 'Busca vídeos no YouTube (ex: /youtube Anitta)',
  async execute(sock, { from, args }) {
    if (!args.length) return sock.sendMessage(from, { text: '❌ Informe o que buscar. Ex: /youtube Anitta' });
    const q = encodeURIComponent(args.join(' '));
    try {
      // Usa a API pública do YouTube Data sem precisar de chave
      const res = await fetch(`https://www.youtube.com/results?search_query=${q}`, {
        headers: { 'User-Agent': 'Mozilla/5.0' },
      });
      const html = await res.text();
      const match = html.match(/var ytInitialData = (.+?);<\/script>/);
      if (!match) throw new Error('Sem resultados');
      const data = JSON.parse(match[1]);
      const items = data?.contents?.twoColumnSearchResultsRenderer?.primaryContents
        ?.sectionListRenderer?.contents?.[0]?.itemSectionRenderer?.contents || [];
      
      const videos = items
        .filter(i => i.videoRenderer)
        .slice(0, 5)
        .map((i, n) => {
          const v = i.videoRenderer;
          const titulo = v.title?.runs?.[0]?.text || 'Sem título';
          const canal = v.ownerText?.runs?.[0]?.text || '';
          const duracao = v.lengthText?.simpleText || '';
          const id = v.videoId;
          return `${n + 1}. *${titulo}*\n   📺 ${canal} | ⏱ ${duracao}\n   🔗 https://youtu.be/${id}`;
        });

      if (!videos.length) return sock.sendMessage(from, { text: '❌ Nenhum resultado encontrado.' });
      await sock.sendMessage(from, {
        text: `🎬 *Resultados para: ${args.join(' ')}*\n\n${videos.join('\n\n')}`,
      });
    } catch (e) {
      await sock.sendMessage(from, { text: '❌ Erro ao buscar no YouTube: ' + e.message });
    }
  },
};
