const { adicionarAgendamento } = require('../../lib/scheduler');

module.exports = {
  name: 'abrir',
  aliases: ['abrirgrupo', 'open'],
  adminOnly: true,
  groupOnly: true,
  description: 'Abre o grupo agora ou agenda abertura (ex: /abrir 22:00 ou /abrir 2h)',
  async execute(sock, ctx) {
    const { from, args, sender, prefix } = ctx;
    const horario = args[0];

    if (!horario) {
      await sock.groupSettingUpdate(from, 'not_announcement');
      await sock.sendMessage(from, {
        text: '🩷 *Gleyce Bot:*\n\n✅ Grupo *ABERTO!* Todos os membros já podem enviar mensagens.',
      });
      return;
    }

    const ag = adicionarAgendamento(from, horario, sender, 'open');
    const horaTexto = horario.includes(':') ? `às ${horario}` : `em ${horario}`;
    await sock.sendMessage(from, {
      text:
        `🩷 *Gleyce Bot — Agendamento criado!*\n\n` +
        `✅ Grupo será *ABERTO* ${horaTexto}\n` +
        `🆔 ID: \`${ag.id}\`\n\n` +
        `O bot abrirá automaticamente, sem precisar de admin online. 🤖\n` +
        `Use *${prefix}cancelarag ${ag.id}* para cancelar.`,
    });
  },
};
