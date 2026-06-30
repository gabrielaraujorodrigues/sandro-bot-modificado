module.exports = {
  name: 'desmute',
  aliases: ['dessilenciar'],
  adminOnly: true,
  groupOnly: true,
  description: 'Reabre o grupo (todos podem enviar mensagens)',
  async execute(sock, ctx) {
    const { from } = ctx;
    await sock.groupSettingUpdate(from, 'not_announcement');
    await sock.sendMessage(from, { text: '🔊 Grupo liberado! Todos os membros podem enviar mensagens novamente.' });
  },
};
