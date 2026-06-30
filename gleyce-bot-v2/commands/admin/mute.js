module.exports = {
  name: 'mute',
  aliases: ['silenciar'],
  adminOnly: true,
  groupOnly: true,
  description: 'Fecha o grupo (apenas admins enviam mensagens)',
  async execute(sock, ctx) {
    const { from } = ctx;
    await sock.groupSettingUpdate(from, 'announcement');
    await sock.sendMessage(from, { text: '🔇 Grupo silenciado! Apenas administradores podem enviar mensagens.' });
  },
};
