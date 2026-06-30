module.exports = {
  name: 'mute', aliases: ['silenciar'],
  adminOnly: true, groupOnly: true,
  description: 'Fecha o grupo (só admins enviam)',
  async execute(sock, { from }) {
    await sock.groupSettingUpdate(from, 'announcement');
    await sock.sendMessage(from, { text: '🔇 Grupo silenciado! Só administradores podem enviar.' });
  },
};
