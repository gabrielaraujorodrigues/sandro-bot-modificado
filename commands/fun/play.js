const os = require('os');
const path = require('path');

module.exports = {
  name: 'play',
  aliases: ['musica', 'música', 'tocar', 'mp3'],
  description: 'Baixa e envia uma música do YouTube (ex: /play Anitta Bang)',
  async execute(sock, { from, args, msg }) {
    if (!args.length)
      return sock.sendMessage(from, { text: '❌ Informe o nome da música.\nEx: *!play Anitta Bang*' }, { quoted: msg });

    let ytdl, ytsr;
    try { ytdl = require('@distube/ytdl-core'); } catch {
      return sock.sendMessage(from, { text: '⚠️ Módulo não instalado. Execute *npm install* na pasta do bot.' }, { quoted: msg });
    }
    try { ytsr = require('ytsr'); } catch {
      return sock.sendMessage(from, { text: '⚠️ Módulo ytsr não instalado. Execute *npm install* na pasta do bot.' }, { quoted: msg });
    }

    const busca = args.join(' ');
    await sock.sendMessage(from, { text: `🔍 Procurando *${busca}*...` }, { quoted: msg });

    try {
      // Buscar no YouTube via ytsr
      const resultado = await ytsr(busca, { limit: 5, safeSearch: false });
      const video = resultado.items.find(
        i => i.type === 'video' && !i.isLive && i.duration
      );

      if (!video) throw new Error('Nenhum vídeo encontrado para: ' + busca);

      // Verificar duração (máx 10 min)
      const partes = video.duration.split(':').map(Number);
      const segundos = partes.length === 3
        ? partes[0] * 3600 + partes[1] * 60 + partes[2]
        : partes[0] * 60 + (partes[1] || 0);

      if (segundos > 600)
        return sock.sendMessage(from, {
          text: `⏱️ Música muito longa (${video.duration}). Limite: 10 minutos.`
        }, { quoted: msg });

      await sock.sendMessage(from, {
        text: `🎶 *${video.title}*\n⏱️ ${video.duration}\n⬇️ Baixando...`
      }, { quoted: msg });

      // Baixar áudio via ytdl-core
      const chunks = [];
      await new Promise((resolve, reject) => {
        const stream = ytdl(video.url, {
          filter: 'audioonly',
          quality: 'lowestaudio',
          requestOptions: {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Linux; Android 12; Pixel 6) AppleWebKit/537.36 Chrome/115.0 Mobile Safari/537.36',
              'Accept-Language': 'pt-BR,pt;q=0.9',
            },
          },
        });
        stream.on('data', c => chunks.push(c));
        stream.on('end', resolve);
        stream.on('error', reject);
      });

      const buffer = Buffer.concat(chunks);

      await sock.sendMessage(from, {
        audio: buffer,
        mimetype: 'audio/mpeg',
        ptt: false,
      }, { quoted: msg });

      await sock.sendMessage(from, {
        text: `✅ *${video.title}* (${video.duration})`
      }, { quoted: msg });

    } catch (e) {
      await sock.sendMessage(from, {
        text: `❌ Não consegui baixar.\n${e.message.slice(0, 150)}\n\nTente com nome diferente.`
      }, { quoted: msg });
    }
  },
};
