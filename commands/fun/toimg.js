const { downloadMediaMessage } = require('@whiskeysockets/baileys');

module.exports = {
  name: 'toimg', aliases: ['paraimagem', 'stickertoimg'],
  description: 'Transforma uma figurinha em imagem (responda a figurinha)',
  async execute(sock, { from, msg }) {
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

    if (!targetMsg.message?.stickerMessage) {
      return sock.sendMessage(from, { text: '❌ Responda a uma *figurinha* com o comando /toimg.' });
    }

    try {
      const buffer = await downloadMediaMessage(targetMsg, 'buffer', {}, {
        logger: require('pino')({ level: 'silent' }),
        reuploadRequest: sock.updateMediaMessage,
      });
      let imgBuffer = buffer;
      try {
        const sharp = require('sharp');
        imgBuffer = await sharp(buffer).png().toBuffer();
      } catch {}
      await sock.sendMessage(from, { image: imgBuffer, mimetype: 'image/png' });
    } catch (e) {
      await sock.sendMessage(from, { text: '❌ Erro ao converter: ' + e.message });
    }
  },
};
