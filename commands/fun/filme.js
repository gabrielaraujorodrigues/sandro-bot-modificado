const fetch = require('node-fetch');
module.exports = {
  name: 'filme', aliases: ['movie', 'buscarfilme'],
  description: 'Busca informações de um filme (ex: /filme Moana)',
  async execute(sock, { from, args }) {
    if (!args.length) return sock.sendMessage(from, { text: '❌ Informe o nome do filme. Ex: /filme Moana' });
    const q = args.join(' ');
    try {
      const res = await fetch(`https://www.omdbapi.com/?t=${encodeURIComponent(q)}&apikey=trilogy&type=movie&plot=short`);
      const d = await res.json();
      if (d.Response === 'False') {
        // Fallback: busca no TMDB sem chave via search
        const res2 = await fetch(`https://api.tvmaze.com/search/shows?q=${encodeURIComponent(q)}`);
        const data2 = await res2.json();
        const show = data2[0]?.show;
        if (show) {
          const txt = `🎬 *${show.name}*\n\n📅 Estreou: ${show.premiered}\n⭐ Nota: ${show.rating?.average || '?'}\n🌍 País: ${show.network?.country?.name || '?'}\n🏷️ Gêneros: ${show.genres?.join(', ')}\n📝 ${show.summary?.replace(/<[^>]*>/g, '').slice(0, 300) || 'Sem sinopse'}`;
          return sock.sendMessage(from, { text: txt });
        }
        return sock.sendMessage(from, { text: `❌ Filme "${q}" não encontrado.` });
      }
      const txt = `🎬 *${d.Title}* (${d.Year})\n\n⭐ IMDb: ${d.imdbRating}/10\n🏆 Oscar: ${d.Awards?.includes('Won') ? 'Sim!' : 'Não'}\n🌍 País: ${d.Country}\n⏱️ Duração: ${d.Runtime}\n🏷️ Gênero: ${d.Genre}\n🎭 Elenco: ${d.Actors}\n\n📝 ${d.Plot}`;
      if (d.Poster && d.Poster !== 'N/A') {
        const imgRes = await fetch(d.Poster);
        const buffer = Buffer.from(await imgRes.arrayBuffer());
        await sock.sendMessage(from, { image: buffer, caption: txt });
      } else {
        await sock.sendMessage(from, { text: txt });
      }
    } catch (e) {
      await sock.sendMessage(from, { text: '❌ Erro ao buscar filme: ' + e.message });
    }
  },
};
