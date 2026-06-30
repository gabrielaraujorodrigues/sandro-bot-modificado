module.exports = {
  name: 'promover',
  aliases: ['promote', 'addadmin'],
  adminOnly: true,
  groupOnly: true,
  description: 'Promove um membro a administrador (responda ou mencione)',
  async execute(sock, ctx) {
    const { from, msg } = ctx;
    const mencionado = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
    const respondido = msg.message?.extendedTextMessage?.contextInfo?.participant;
    const alvo = mencionado || respondido;

    if (!alvo) {
      await sock.sendMessage(from, { text: '❌ Mencione ou responda a mensagem de quem deseja promover.' });
      return;
    }

    try {
      await sock.groupParticipantsUpdate(from, [alvo], 'promote');
      await sock.sendMessage(from, { text: `✅ @${alvo.split('@')[0]} agora é administrador!`, mentions: [alvo] });
    } catch (e) {
      await sock.sendMessage(from, { text: '❌ Não foi possível promover. Verifique se sou admin no grupo.' });
    }
  },
};
