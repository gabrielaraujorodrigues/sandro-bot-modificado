module.exports = {
  name: 'linkgp', aliases: ['linkgrupo', 'grouplink'],
  groupOnly: true,
  description: 'Mostra o link de convite do grupo',
  async execute(sock, { from }) {
    try {
      const code = await sock.groupInviteCode(from);
      await sock.sendMessage(from, { text: `🔗 *Link do grupo:*\nhttps://chat.whatsapp.com/${code}` });
    } catch {
      await sock.sendMessage(from, { text: '❌ Não foi possível obter o link. Preciso ser admin.' });
    }
  },
};
