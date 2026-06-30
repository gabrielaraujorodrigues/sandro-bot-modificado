module.exports = {
  name: 'feio',
  description: 'Feio — brincadeira com menção ou resposta',
  async execute(sock, { from, msg, sender }) {
    const ctx = msg.message?.extendedTextMessage?.contextInfo;
    const alvo = ctx?.mentionedJid?.[0] || ctx?.participant;
    if (!alvo) return sock.sendMessage(from, { text: '❌ Mencione ou responda a mensagem de alguém. Ex: /feio @pessoa' });
    const pct = Math.floor(Math.random() * 101);
    await sock.sendMessage(from, {
      text: '🎯 *Feio*\n\n@' + alvo.split('@')[0] + ' — A feiúra de ' + pct + '% de feiúra! 😬',
      mentions: [alvo],
    });
  },
};
