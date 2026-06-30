const fetch = require('node-fetch');

module.exports = {
  name: 'letra',
  aliases: ['lyric', 'lyrics', 'musica'],
  description: 'Busca letra de música (ex: /letra Anitta Bang)',
  async execute(sock, { from, args }) {
    if (args.length < 2) return sock.sendMessage(from, { text: '❌ Use: /letra <artista> <música>\nEx: /letra Anitta Bang' });
    
    // Tenta dividir artista e música
    const texto = args.join(' ');
    // Heurística: primeiro argumento = artista, resto = música
    const artista = args[0];
    const musica = args.slice(1).join(' ');

    try {
      const res = await fetch(`https://api.lyrics.ovh/v1/${encodeURIComponent(artista)}/${encodeURIComponent(musica)}`);
      if (!res.ok) throw new Error('Não encontrado');
      const data = await res.json();
      if (!data.lyrics) throw new Error('Sem letra');
      
      const letra = data.lyrics.trim();
      // Limitar tamanho (WhatsApp tem limite)
      const limite = 3500;
      const msg = letra.length > limite ? letra.slice(0, limite) + '\n\n_...letra muito longa, mostrando trecho_' : letra;
      
      await sock.sendMessage(from, {
        text: `🎵 *${artista} — ${musica}*\n\n${msg}`,
      });
    } catch {
      // Fallback: link do Vagalume
      const q = encodeURIComponent(`${artista} ${musica}`);
      await sock.sendMessage(from, {
        text: `❌ Letra não encontrada na base de dados.\n\n🔍 Tente buscar aqui:\nhttps://www.vagalume.com.br/pesquisa/?q=${q}`,
      });
    }
  },
};
