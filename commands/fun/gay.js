module.exports = {
  name: 'gay',
  description: 'Gay — brincadeira com menção ou resposta',
  async execute(sock, { from, msg, sender }) {
    const ctx = msg.message?.extendedTextMessage?.contextInfo;
    const alvo = ctx?.mentionedJid?.[0] || ctx?.participant;
    if (!alvo) return sock.sendMessage(from, { text: '❌ Mencione ou responda a mensagem de alguém. Ex: /gay @pessoa' });
    const pct = Math.floor(Math.random() * 101);
    await sock.sendMessage(from, {
      text: '🎯 *Gay*\n\n@' + alvo.split('@')[0] + ' — Você é gay em ' + pct + '% de gay! 🌈',
      mentions: [alvo],
    });
  },
};
