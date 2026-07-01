const fs = require('fs');
const path = require('path');
const os = require('os');

module.exports = {
  name: 'play',
  aliases: ['musica', 'música', 'tocar', 'mp3'],
  description: 'Baixa e envia uma música do YouTube (ex: /play Anitta)',
  async execute(sock, { from, args, msg }) {
    if (!args.length) return sock.sendMessage(from, { text: '❌ Informe o nome da música. Ex: /play Anitta Bang' });

    const busca = args.join(' ');
    await sock.sendMessage(from, { text: `🎵 Buscando *${busca}*... aguarde!` }, { quoted: msg });

    let ytdl;
    try {
      ytdl = require('@distube/ytdl-core');
    } catch (e) {
      return sock.sendMessage(from, { text: '⚠️ Módulo de música não instalado.\nExecute: npm install\nDepois tente novamente.' });
    }

    try {
      // Buscar URL via scraping simples do YouTube
      const fetch = require('node-fetch');
      const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(busca)}`;
      const html = await fetch(searchUrl, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Android 10; Mobile; rv:109.0) Gecko/109.0 Firefox/109.0' }
      }).then(r => r.text());

      const match = html.match(/"videoId":"([a-zA-Z0-9_-]{11})"/);
      if (!match) throw new Error('Nenhum resultado encontrado para: ' + busca);

      const videoId = match[1];
      const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;

      // Buscar info do vídeo
      const info = await ytdl.getInfo(videoUrl);
      const titulo = info.videoDetails.title;
      const duracao = Math.floor(info.videoDetails.lengthSeconds / 60);

      if (info.videoDetails.lengthSeconds > 600) {
        return sock.sendMessage(from, { text: `⏱️ Música muito longa (${duracao} min). Limite: 10 minutos.` }, { quoted: msg });
      }

      // Baixar áudio
      const tempFile = path.join(os.tmpdir(), `play_${Date.now()}.mp3`);
      const chunks = [];

      await new Promise((resolve, reject) => {
        const stream = ytdl(videoUrl, {
          filter: 'audioonly',
          quality: 'lowestaudio',
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
        text: `🎵 *${titulo}*\n⏱️ Duração: ${duracao} min`,
      }, { quoted: msg });

    } catch (e) {
      await sock.sendMessage(from, {
        text: `❌ Não foi possível baixar a música.\nErro: ${e.message.slice(0, 120)}\n\nTente outro nome ou artista.`,
      }, { quoted: msg });
    }
  },
};
