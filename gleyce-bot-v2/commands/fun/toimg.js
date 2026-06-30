const { downloadMediaMessage } = require('@whiskeysockets/baileys');

module.exports = {
  name: 'toimg',
  aliases: ['paraimagem'],
  description: 'Transforma uma figurinha em imagem (responda a figurinha)',
  async execute(sock, ctx) {
    const { from, msg } = ctx;
    const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
    const targetMsg = quoted
      ? { message: quoted, key: { remoteJid: from, id: msg.message.extendedTextMessage.contextInfo.stanzaId } }
      : msg;

    if (!targetMsg.message?.stickerMessage) {
      await sock.sendMessage(from, { text: '❌ Responda a uma figurinha com o comando /toimg.' });
      return;
    }

    try {
      const buffer = await downloadMediaMessage(targetMsg, 'buffer', {});
      await sock.sendMessage(from, { image: buffer });
    } catch (e) {
      await sock.sendMessage(from, { text: '❌ Erro ao converter: ' + e.message });
    }
  },
};
