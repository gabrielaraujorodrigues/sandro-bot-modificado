// play.js — usa play-dl (acessa Innertube API do YouTube, sem scraping HTML)
module.exports = {
  name: 'play',
  aliases: ['musica', 'música', 'tocar', 'mp3'],
  description: 'Baixa e envia uma música do YouTube (ex: /play Anitta Bang)',
  async execute(sock, { from, args, msg }) {
    if (!args.length)
      return sock.sendMessage(from, { text: '❌ Informe o nome da música.\nEx: *!play Anitta Bang*' }, { quoted: msg });

    let play;
    try { play = require('play-dl'); } catch {
      return sock.sendMessage(from, { text: '⚠️ Módulo não instalado. Execute *npm install* na pasta do bot.' }, { quoted: msg });
    }

    const busca = args.join(' ');
    await sock.sendMessage(from, { text: `🔍 Procurando *${busca}*...` }, { quoted: msg });

    try {
      // Buscar vídeo
      const resultados = await play.search(busca, { source: { youtube: 'video' }, limit: 5 });
      const video = resultados.find(v => v.durationInSec > 0 && v.durationInSec <= 600);

      if (!video) {
        const primeiro = resultados[0];
        if (primeiro && primeiro.durationInSec > 600) {
          return sock.sendMessage(from, {
            text: `⏱️ Música muito longa (${primeiro.durationInSec}s). Limite: 10 minutos.`
          }, { quoted: msg });
        }
        throw new Error('Nenhum resultado encontrado para: ' + busca);
      }

      const min = Math.floor(video.durationInSec / 60);
      const seg = video.durationInSec % 60;

      await sock.sendMessage(from, {
        text: `🎶 *${video.title}*\n⏱️ ${min}:${String(seg).padStart(2,'0')}\n⬇️ Baixando...`
      }, { quoted: msg });

      // Stream de áudio
      const stream = await play.stream(video.url, { quality: 0 });

      const chunks = [];
      await new Promise((resolve, reject) => {
        stream.stream.on('data', c => chunks.push(c));
        stream.stream.on('end', resolve);
        stream.stream.on('error', reject);
      });

      const buffer = Buffer.concat(chunks);
      const mimetype = stream.type === 'opus' ? 'audio/ogg; codecs=opus' : 'audio/mp4';

      await sock.sendMessage(from, {
        audio: buffer,
        mimetype,
        ptt: false,
      }, { quoted: msg });

      await sock.sendMessage(from, {
        text: `✅ *${video.title}* (${min}:${String(seg).padStart(2,'0')})`
      }, { quoted: msg });

    } catch (e) {
      await sock.sendMessage(from, {
        text: `❌ Erro ao baixar: ${e.message.slice(0, 200)}\n\nTente com nome diferente.`
      }, { quoted: msg });
    }
  },
};
