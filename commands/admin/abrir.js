const { adicionarAgendamento } = require('../../lib/scheduler');
module.exports = {
  name: 'abrir', aliases: ['abrirgrupo', 'open'],
  adminOnly: true, groupOnly: true,
  description: 'Abre o grupo agora ou agenda abertura (ex: /abrir 22:00)',
  async execute(sock, { from, args, sender, prefix }) {
    const horario = args[0];
    if (!horario) {
      await sock.groupSettingUpdate(from, 'not_announcement');
      return sock.sendMessage(from, { text: '✅ Grupo *ABERTO!* Todos podem enviar mensagens.' });
    }
    const ag = adicionarAgendamento(from, horario, sender, 'open');
    const h = horario.includes(':') ? `às ${horario}` : `em ${horario}`;
    await sock.sendMessage(from, { text: `✅ Grupo será *ABERTO* ${h}\n🆔 ID: \`${ag.id}\`\nUse *${prefix}cancelarag ${ag.id}* para cancelar.` });
  },
};
