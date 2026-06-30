module.exports = {
  name: 'matar',
  description: 'Matar — brincadeira com menção ou resposta',
  async execute(sock, { from, msg, sender }) {
    const ctx = msg.message?.extendedTextMessage?.contextInfo;
    const alvo = ctx?.mentionedJid?.[0] || ctx?.participant;
    if (!alvo) return sock.sendMessage(from, { text: '❌ Mencione ou responda a mensagem de alguém. Ex: /matar @pessoa' });
    const pct = Math.floor(Math.random() * 101);
    await sock.sendMessage(from, {
      text: '🎯 *Matar*\n\n@' + alvo.split('@')[0] + ' — Quer matar ' + pct + 'Cuidado! 💀',
      mentions: [alvo],
    });
  },
};
