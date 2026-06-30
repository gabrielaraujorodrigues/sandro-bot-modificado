module.exports = {
  name: 'kick',
  aliases: ['ban', 'remover'],
  adminOnly: true,
  groupOnly: true,
  description: 'Remove um membro do grupo (responda ou mencione)',
  async execute(sock, ctx) {
    const { from, msg } = ctx;
    const mencionado = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
    const respondido = msg.message?.extendedTextMessage?.contextInfo?.participant;
    const alvo = mencionado || respondido;

    if (!alvo) {
      await sock.sendMessage(from, { text: '❌ Mencione ou responda a mensagem de quem deseja remover.' });
      return;
    }

    try {
      await sock.groupParticipantsUpdate(from, [alvo], 'remove');
      await sock.sendMessage(from, { text: `✅ @${alvo.split('@')[0]} foi removido do grupo.`, mentions: [alvo] });
    } catch (e) {
      await sock.sendMessage(from, { text: '❌ Não foi possível remover. Verifique se sou admin no grupo.' });
    }
  },
};
