module.exports = {
  name: 'sairgp', aliases: ['sairgrupo', 'leave'],
  ownerOnly: true,
  description: 'O bot sai do grupo atual (só dono)',
  async execute(sock, { from, isGroup }) {
    if (!isGroup) return sock.sendMessage(from, { text: '❌ Use em um grupo.' });
    await sock.sendMessage(from, { text: '👋 Saindo do grupo... até mais!' });
    await sock.groupLeave(from);
  },
};
