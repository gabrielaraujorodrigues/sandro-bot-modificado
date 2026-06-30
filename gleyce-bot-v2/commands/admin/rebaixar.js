module.exports = {
  name: 'rebaixar',
  aliases: ['demote', 'removeradmin'],
  adminOnly: true,
  groupOnly: true,
  description: 'Remove o cargo de administrador de um membro (responda ou mencione)',
  async execute(sock, ctx) {
    const { from, msg } = ctx;
    const mencionado = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
    const respondido = msg.message?.extendedTextMessage?.contextInfo?.participant;
    const alvo = mencionado || respondido;

    if (!alvo) {
      await sock.sendMessage(from, { text: '❌ Mencione ou responda a mensagem de quem deseja rebaixar.' });
      return;
    }

    try {
      await sock.groupParticipantsUpdate(from, [alvo], 'demote');
      await sock.sendMessage(from, { text: `✅ @${alvo.split('@')[0]} não é mais administrador.`, mentions: [alvo] });
    } catch (e) {
      await sock.sendMessage(from, { text: '❌ Não foi possível rebaixar. Verifique se sou admin no grupo.' });
    }
  },
};
