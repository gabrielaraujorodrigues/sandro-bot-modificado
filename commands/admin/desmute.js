module.exports = {
  name: 'desmute', aliases: ['dessilenciar'],
  adminOnly: true, groupOnly: true,
  description: 'Libera o grupo para todos enviarem',
  async execute(sock, { from }) {
    await sock.groupSettingUpdate(from, 'not_announcement');
    await sock.sendMessage(from, { text: '🔊 Grupo liberado! Todos podem enviar mensagens.' });
  },
};
