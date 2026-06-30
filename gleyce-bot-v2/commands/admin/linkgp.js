module.exports = {
  name: 'linkgp',
  aliases: ['linkgrupo', 'grouplink'],
  groupOnly: true,
  description: 'Mostra o link de convite do grupo',
  async execute(sock, ctx) {
    const { from } = ctx;
    try {
      const codigo = await sock.groupInviteCode(from);
      await sock.sendMessage(from, { text: `🔗 *Link do grupo:*\nhttps://chat.whatsapp.com/${codigo}` });
    } catch (e) {
      await sock.sendMessage(from, { text: '❌ Não foi possível obter o link. Verifique se sou admin no grupo.' });
    }
  },
};
