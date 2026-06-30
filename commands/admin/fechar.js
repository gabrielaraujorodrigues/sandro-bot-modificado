const { adicionarAgendamento } = require('../../lib/scheduler');
module.exports = {
  name: 'fechar', aliases: ['fechargrupo', 'close'],
  adminOnly: true, groupOnly: true,
  description: 'Fecha o grupo agora ou agenda fechamento (ex: /fechar 23:00)',
  async execute(sock, { from, args, sender, prefix }) {
    const horario = args[0];
    if (!horario) {
      await sock.groupSettingUpdate(from, 'announcement');
      return sock.sendMessage(from, { text: '🔒 Grupo *FECHADO!* Só admins podem enviar mensagens.' });
    }
    const ag = adicionarAgendamento(from, horario, sender, 'close');
    const h = horario.includes(':') ? `às ${horario}` : `em ${horario}`;
    await sock.sendMessage(from, { text: `✅ Grupo será *FECHADO* ${h}\n🆔 ID: \`${ag.id}\`\nUse *${prefix}cancelarag ${ag.id}* para cancelar.` });
  },
};
