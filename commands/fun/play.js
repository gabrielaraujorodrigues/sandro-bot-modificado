const { exec } = require('child_process');
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
    const aguardar = await sock.sendMessage(from, { text: `🎵 Buscando *${busca}*...` });

    try {
      // Usa yt-dlp se disponível, senão ytdl-core
      const tempFile = path.join(os.tmpdir(), `play_${Date.now()}.mp3`);
      
      await new Promise((resolve, reject) => {
        const cmd = `yt-dlp --no-playlist -x --audio-format mp3 --audio-quality 5 -o "${tempFile.replace('.mp3', '.%(ext)s')}" "ytsearch1:${busca}" 2>&1`;
        exec(cmd, { timeout: 60000 }, (err, stdout, stderr) => {
          if (err) return reject(new Error('yt-dlp não encontrado ou erro: ' + (stderr || err.message)));
          resolve();
        });
      });

      // Encontrar o arquivo gerado
      const dir = path.dirname(tempFile);
      const base = path.basename(tempFile, '.mp3');
      const arquivos = fs.readdirSync(dir).filter(f => f.startsWith(base.replace('.mp3','')));
      const arquivo = arquivos[0] ? path.join(dir, arquivos[0]) : tempFile;

      if (!fs.existsSync(arquivo)) throw new Error('Arquivo não gerado');

      const buffer = fs.readFileSync(arquivo);
      fs.unlinkSync(arquivo);

      await sock.sendMessage(from, {
        audio: buffer,
        mimetype: 'audio/mpeg',
        ptt: false,
      }, { quoted: msg });

    } catch (e) {
      // Fallback: informar como instalar
      await sock.sendMessage(from, {
        text: `⚠️ Para usar /play, instale o *yt-dlp* no servidor:\n\n` +
              `*Linux/Termux:*\npip install yt-dlp\n\nou\n\n` +
              `*npm:*\nnpm install -g yt-dlp\n\nErro: ${e.message.slice(0, 100)}`,
      });
    }
  },
};
