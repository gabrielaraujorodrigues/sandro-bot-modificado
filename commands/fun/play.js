const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

function executar(cmd) {
  return new Promise((resolve, reject) => {
    exec(cmd, { timeout: 90000 }, (err, stdout, stderr) => {
      if (err) reject(new Error(stderr || err.message));
      else resolve(stdout);
    });
  });
}

module.exports = {
  name: 'play',
  aliases: ['musica', 'música', 'tocar', 'mp3'],
  description: 'Baixa e envia uma música do YouTube (ex: /play Anitta Bang)',
  async execute(sock, { from, args, msg }) {
    if (!args.length)
      return sock.sendMessage(from, { text: '❌ Informe o nome da música.\nEx: *!play Anitta Bang*' }, { quoted: msg });

    // Verificar se yt-dlp está instalado
    try { await executar('yt-dlp --version'); } catch {
      return sock.sendMessage(from, {
        text: '⚠️ *yt-dlp não instalado!*\n\nInstale no Termux:\n```\npip install yt-dlp\n```\nDepois reinicie o bot.'
      }, { quoted: msg });
    }

    const busca = args.join(' ');
    await sock.sendMessage(from, { text: `🔍 Procurando *${busca}*...` }, { quoted: msg });

    const tmpDir = os.tmpdir();
    const tmpBase = path.join(tmpDir, `play_${Date.now()}`);

    try {
      // Buscar info do vídeo primeiro (sem baixar)
      const infoJson = await executar(
        `yt-dlp --no-playlist --dump-json "ytsearch1:${busca.replace(/"/g, '')}"`
      );
      const info = JSON.parse(infoJson.trim().split('\n')[0]);

      if (info.duration > 600) {
        const min = Math.floor(info.duration / 60);
        return sock.sendMessage(from, {
          text: `⏱️ Música muito longa (${min} min). Limite: 10 minutos.`
        }, { quoted: msg });
      }

      const min = Math.floor(info.duration / 60);
      const seg = info.duration % 60;

      await sock.sendMessage(from, {
        text: `🎶 *${info.title}*\n⏱️ ${min}:${String(seg).padStart(2,'0')}\n⬇️ Baixando...`
      }, { quoted: msg });

      // Baixar áudio
      await executar(
        `yt-dlp --no-playlist -x --audio-format mp3 --audio-quality 5 -o "${tmpBase}.%(ext)s" "${info.webpage_url}"`
      );

      // Encontrar arquivo gerado
      const arquivos = fs.readdirSync(tmpDir).filter(f => f.startsWith(path.basename(tmpBase)));
      if (!arquivos.length) throw new Error('Arquivo de áudio não gerado.');

      const arquivo = path.join(tmpDir, arquivos[0]);
      const buffer = fs.readFileSync(arquivo);
      try { fs.unlinkSync(arquivo); } catch {}

      await sock.sendMessage(from, {
        audio: buffer,
        mimetype: 'audio/mpeg',
        ptt: false,
      }, { quoted: msg });

      await sock.sendMessage(from, {
        text: `✅ *${info.title}* (${min}:${String(seg).padStart(2,'0')})`
      }, { quoted: msg });

    } catch (e) {
      // Limpar arquivos temporários
      try {
        fs.readdirSync(tmpDir).filter(f => f.startsWith(path.basename(tmpBase)))
          .forEach(f => fs.unlinkSync(path.join(tmpDir, f)));
      } catch {}
      await sock.sendMessage(from, {
        text: `❌ Erro: ${e.message.slice(0, 200)}\n\nTente com nome diferente.`
      }, { quoted: msg });
    }
  },
};
