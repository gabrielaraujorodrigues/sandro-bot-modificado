// play.js — usa Invidious API (espelho público do YouTube)
// Não depende de ytdl-core, ytsr ou yt-dlp — apenas node-fetch (já instalado)

const INSTANCIAS = [
  'https://invidious.io.lol',
  'https://inv.nadeko.net',
  'https://yt.cdaut.de',
  'https://invidious.privacydev.net',
  'https://invidious.nerdvpn.de',
];

async function apiGet(path) {
  const fetch = require('node-fetch');
  for (const base of INSTANCIAS) {
    try {
      const res = await fetch(`${base}${path}`, {
        timeout: 12000,
        headers: { 'User-Agent': 'Mozilla/5.0' },
      });
      if (!res.ok) continue;
      return await res.json();
    } catch { continue; }
  }
  throw new Error('Todas as instâncias do Invidious falharam. Tente de novo em instantes.');
}

async function buscar(query) {
  const data = await apiGet(
    `/api/v1/search?q=${encodeURIComponent(query)}&type=video&fields=videoId,title,lengthSeconds&limit=8`
  );
  const video = data.find(v => v.lengthSeconds > 0 && v.lengthSeconds <= 600);
  if (!video) throw new Error('Nenhum vídeo encontrado (ou todos muito longos). Tente outro nome.');
  return video;
}

async function getAudioUrl(videoId) {
  const data = await apiGet(
    `/api/v1/videos/${videoId}?fields=adaptiveFormats,title,lengthSeconds`
  );
  // Preferir opus/webm ou mp4 audio
  const fmt = (data.adaptiveFormats || [])
    .filter(f => f.type && f.type.startsWith('audio/') && f.url)
    .sort((a, b) => (parseInt(a.bitrate) || 0) - (parseInt(b.bitrate) || 0))[0];
  if (!fmt) throw new Error('Nenhum formato de áudio disponível para este vídeo.');
  return fmt.url;
}

module.exports = {
  name: 'play',
  aliases: ['musica', 'música', 'tocar', 'mp3'],
  description: 'Baixa e envia uma música do YouTube (ex: /play Anitta Bang)',
  async execute(sock, { from, args, msg }) {
    if (!args.length)
      return sock.sendMessage(from, { text: '❌ Informe o nome da música.\nEx: *!play Anitta Bang*' }, { quoted: msg });

    const fetch = require('node-fetch');
    const busca = args.join(' ');
    await sock.sendMessage(from, { text: `🔍 Procurando *${busca}*...` }, { quoted: msg });

    try {
      const video = await buscar(busca);
      const min = Math.floor(video.lengthSeconds / 60);
      const seg = video.lengthSeconds % 60;

      await sock.sendMessage(from, {
        text: `🎶 *${video.title}*\n⏱️ ${min}:${String(seg).padStart(2,'0')}\n⬇️ Baixando...`
      }, { quoted: msg });

      const audioUrl = await getAudioUrl(video.videoId);

      const response = await fetch(audioUrl, {
        timeout: 60000,
        headers: { 'User-Agent': 'Mozilla/5.0' },
      });
      if (!response.ok) throw new Error(`Erro ao baixar: HTTP ${response.status}`);

      const buffer = await response.buffer();

      // Detectar mimetype
      const tipo = audioUrl.includes('webm') ? 'audio/ogg; codecs=opus' : 'audio/mp4';

      await sock.sendMessage(from, {
        audio: buffer,
        mimetype: tipo,
        ptt: false,
      }, { quoted: msg });

      await sock.sendMessage(from, {
        text: `✅ *${video.title}* (${min}:${String(seg).padStart(2,'0')})`
      }, { quoted: msg });

    } catch (e) {
      await sock.sendMessage(from, {
        text: `❌ Não consegui baixar.\n${e.message.slice(0, 200)}\n\nTente novamente ou com nome diferente.`
      }, { quoted: msg });
    }
  },
};
