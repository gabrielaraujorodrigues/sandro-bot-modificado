module.exports = {
  name: 'kick', aliases: ['ban', 'remover', 'expulsar'],
  adminOnly: true, groupOnly: true,
  description: 'Remove um membro do grupo (responda ou mencione)',
  async execute(sock, { from, msg }) {
    const ctx = msg.message?.extendedTextMessage?.contextInfo;
    const alvo = ctx?.mentionedJid?.[0] || ctx?.participant;
    if (!alvo) return sock.sendMessage(from, { text: '❌ Mencione ou responda a mensagem de quem deseja remover.' });
    try {
      await sock.groupParticipantsUpdate(from, [alvo], 'remove');
      await sock.sendMessage(from, { text: `✅ @${alvo.split('@')[0]} foi removido.`, mentions: [alvo] });
    } catch (e) {
      await sock.sendMessage(from, { text: '❌ Não foi possível remover. Verifique se sou admin.' });
    }
  },
};
