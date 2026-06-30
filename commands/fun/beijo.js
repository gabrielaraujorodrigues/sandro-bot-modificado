module.exports = {
  name: 'beijo',
  description: 'Beijo — brincadeira com menção ou resposta',
  async execute(sock, { from, msg, sender }) {
    const ctx = msg.message?.extendedTextMessage?.contextInfo;
    const alvo = ctx?.mentionedJid?.[0] || ctx?.participant;
    if (!alvo) return sock.sendMessage(from, { text: '❌ Mencione ou responda a mensagem de alguém. Ex: /beijo @pessoa' });
    const pct = Math.floor(Math.random() * 101);
    await sock.sendMessage(from, {
      text: '🎯 *Beijo*\n\n@' + alvo.split('@')[0] + ' — Mandou um beijo para ' + pct + 'Beijooo! 😘',
      mentions: [alvo],
    });
  },
};
