const { downloadMediaMessage } = require('@whiskeysockets/baileys');

module.exports = {
  name: 'sticker',
  aliases: ['s', 'figurinha'],
  description: 'Transforma uma imagem/vídeo em figurinha (responda a mídia)',
  async execute(sock, ctx) {
    const { from, msg } = ctx;
    const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
    const targetMsg = quoted
      ? { message: quoted, key: { remoteJid: from, id: msg.message.extendedTextMessage.contextInfo.stanzaId } }
      : msg;

    const temMidia = targetMsg.message?.imageMessage || targetMsg.message?.videoMessage;
    if (!temMidia) {
      await sock.sendMessage(from, { text: '❌ Envie ou responda a uma imagem/vídeo com o comando /sticker.' });
      return;
    }

    try {
      const buffer = await downloadMediaMessage(targetMsg, 'buffer', {});
      await sock.sendMessage(from, { sticker: buffer });
    } catch (e) {
      await sock.sendMessage(from, { text: '❌ Erro ao criar figurinha: ' + e.message });
    }
  },
};
