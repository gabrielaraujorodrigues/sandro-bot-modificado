module.exports = {
  name: 'rebaixar', aliases: ['demote', 'removeradmin'],
  adminOnly: true, groupOnly: true,
  description: 'Remove cargo de admin de um membro (responda ou mencione)',
  async execute(sock, { from, msg }) {
    const ctx = msg.message?.extendedTextMessage?.contextInfo;
    const alvo = ctx?.mentionedJid?.[0] || ctx?.participant;
    if (!alvo) return sock.sendMessage(from, { text: '❌ Mencione ou responda a mensagem de quem deseja rebaixar.' });
    try {
      await sock.groupParticipantsUpdate(from, [alvo], 'demote');
      await sock.sendMessage(from, { text: `✅ @${alvo.split('@')[0]} não é mais administrador.`, mentions: [alvo] });
    } catch {
      await sock.sendMessage(from, { text: '❌ Não foi possível rebaixar. Verifique se sou admin.' });
    }
  },
};
