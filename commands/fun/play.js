const path = require('path');
const os = require('os');

// Instâncias públicas da Piped API (espelhos do YouTube sem bloqueio)
const PIPED_INSTANCES = [
  'https://pipedapi.kavin.rocks',
  'https://piped-api.garudalinux.org',
  'https://api.piped.yt',
];

async function buscarYoutube(query) {
  const fetch = require('node-fetch');
  for (const base of PIPED_INSTANCES) {
    try {
      const url = `${base}/search?q=${encodeURIComponent(query)}&filter=videos`;
      const res = await fetch(url, { timeout: 10000 });
      if (!res.ok) continue;
      const data = await res.json();
      const item = data.items?.find(i => i.type === 'stream' && i.duration > 0 && i.duration <= 600);
      if (item) return {
        id: item.url?.replace('/watch?v=', '') || item.id,
        titulo: item.title,
        duracao: item.duration,
        url: `https://www.youtube.com/watch?v=${item.url?.replace('/watch?v=', '') || item.id}`,
      };
    } catch (_) { continue; }
  }
  throw new Error('Nenhum resultado encontrado. Tente outro nome.');
}

module.exports = {
  name: 'play',
  aliases: ['musica', 'música', 'tocar', 'mp3'],
  description: 'Baixa e envia uma música do YouTube (ex: /play Anitta Bang)',
  async execute(sock, { from, args, msg }) {
    if (!args.length) {
      return sock.sendMessage(from, { text: '❌ Informe o nome da música.\nEx: *!play Anitta Bang*' }, { quoted: msg });
    }

    let ytdl;
    try {
      ytdl = require('@distube/ytdl-core');
    } catch {
      return sock.sendMessage(from, {
        text: '⚠️ Módulo não instalado. Execute *npm install* na pasta do bot.',
      }, { quoted: msg });
    }

    const busca = args.join(' ');
    await sock.sendMessage(from, { text: `🎵 Procurando *${busca}*...` }, { quoted: msg });

    try {
      const video = await buscarYoutube(busca);

      const min = Math.floor(video.duracao / 60);
      const seg = video.duracao % 60;
      await sock.sendMessage(from, {
        text: `🎶 Encontrado: *${video.titulo}*\n⏱️ ${min}:${String(seg).padStart(2,'0')}\n⬇️ Baixando...`,
      }, { quoted: msg });

      const chunks = [];
      await new Promise((resolve, reject) => {
        const stream = ytdl(video.url, {
          filter: 'audioonly',
          quality: 'lowestaudio',
          requestOptions: {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Linux; Android 12) AppleWebKit/537.36 Chrome/115.0.0.0 Mobile Safari/537.36',
            },
          },
        });
        stream.on('data', chunk => chunks.push(chunk));
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
        text: `✅ *${video.titulo}*\n⏱️ ${min}:${String(seg).padStart(2,'0')}`,
      }, { quoted: msg });

    } catch (e) {
      await sock.sendMessage(from, {
        text: `❌ Não consegui baixar.\n${e.message.slice(0, 150)}\n\nTente com nome diferente ou mais específico.`,
      }, { quoted: msg });
    }
  },
};
