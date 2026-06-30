module.exports = {
  name: 'promover', aliases: ['promote', 'addadmin'],
  adminOnly: true, groupOnly: true,
  description: 'Promove membro a administrador (responda ou mencione)',
  async execute(sock, { from, msg }) {
    const ctx = msg.message?.extendedTextMessage?.contextInfo;
    const alvo = ctx?.mentionedJid?.[0] || ctx?.participant;
    if (!alvo) return sock.sendMessage(from, { text: '❌ Mencione ou responda a mensagem de quem deseja promover.' });
    try {
      await sock.groupParticipantsUpdate(from, [alvo], 'promote');
      await sock.sendMessage(from, { text: `✅ @${alvo.split('@')[0]} agora é administrador!`, mentions: [alvo] });
    } catch {
      await sock.sendMessage(from, { text: '❌ Não foi possível promover. Verifique se sou admin.' });
    }
  },
};
