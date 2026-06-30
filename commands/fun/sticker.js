const { downloadMediaMessage } = require('@whiskeysockets/baileys');

module.exports = {
  name: 'sticker', aliases: ['s', 'figurinha', 'fig'],
  description: 'Transforma imagem/vídeo em figurinha (responda a mídia ou envie com o comando)',
  async execute(sock, { from, msg }) {
    // Suporta: responder a uma mídia OU enviar a mídia com o comando como legenda
    const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
    let targetMsg = msg;

    if (quoted) {
      targetMsg = {
        message: quoted,
        key: {
          remoteJid: from,
          id: msg.message.extendedTextMessage.contextInfo.stanzaId,
          participant: msg.message.extendedTextMessage.contextInfo.participant,
        },
      };
    }

    const msgContent = targetMsg.message;
    const temImagem = msgContent?.imageMessage;
    const temVideo = msgContent?.videoMessage;
    const temSticker = msgContent?.stickerMessage;

    if (!temImagem && !temVideo && !temSticker) {
      return sock.sendMessage(from, {
        text: '❌ Envie uma *imagem ou vídeo* com o comando /sticker, ou responda a uma mídia.',
      });
    }

    try {
      const buffer = await downloadMediaMessage(targetMsg, 'buffer', {}, {
        logger: require('pino')({ level: 'silent' }),
        reuploadRequest: sock.updateMediaMessage,
      });

      if (temImagem || temSticker) {
        // Imagem: converte para WebP com sharp se disponível
        let stickerBuffer = buffer;
        try {
          const sharp = require('sharp');
          stickerBuffer = await sharp(buffer)
            .resize(512, 512, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
            .webp()
            .toBuffer();
        } catch {
          // sharp não instalado — tenta enviar direto
        }
        await sock.sendMessage(from, {
          sticker: stickerBuffer,
          mimetype: 'image/webp',
        });
      } else if (temVideo) {
        // Vídeo: tenta usar sharp (só funciona se for GIF/WebP), senão avisa
        try {
          const sharp = require('sharp');
          const frames = await sharp(buffer, { animated: true })
            .resize(512, 512, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
            .webp({ quality: 80 })
            .toBuffer();
          await sock.sendMessage(from, { sticker: frames, mimetype: 'image/webp' });
        } catch {
          await sock.sendMessage(from, {
            text: '⚠️ Sticker de vídeo requer ffmpeg instalado no servidor.\nPara figurinha de imagem, envie uma *foto* com /sticker.',
          });
        }
      }
    } catch (e) {
      await sock.sendMessage(from, { text: '❌ Erro ao criar figurinha: ' + e.message });
    }
  },
};
