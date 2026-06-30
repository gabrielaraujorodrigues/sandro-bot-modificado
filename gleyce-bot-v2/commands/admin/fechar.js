const { adicionarAgendamento } = require('../../lib/scheduler');

module.exports = {
  name: 'fechar',
  aliases: ['fechargrupo', 'close'],
  adminOnly: true,
  groupOnly: true,
  description: 'Fecha o grupo agora ou agenda fechamento (ex: /fechar 23:00 ou /fechar 30m)',
  async execute(sock, ctx) {
    const { from, args, sender, prefix } = ctx;
    const horario = args[0];

    if (!horario) {
      await sock.groupSettingUpdate(from, 'announcement');
      await sock.sendMessage(from, {
        text: '🔒 *Gleyce Bot:*\n\n✅ Grupo *FECHADO!* Só administradores podem enviar mensagens.',
      });
      return;
    }

    const ag = adicionarAgendamento(from, horario, sender, 'close');
    const horaTexto = horario.includes(':') ? `às ${horario}` : `em ${horario}`;
    await sock.sendMessage(from, {
      text:
        `🔒 *Gleyce Bot — Agendamento criado!*\n\n` +
        `✅ Grupo será *FECHADO* ${horaTexto}\n` +
        `🆔 ID: \`${ag.id}\`\n\n` +
        `O bot fechará automaticamente, sem precisar de admin online. 🤖\n` +
        `Use *${prefix}cancelarag ${ag.id}* para cancelar.`,
    });
  },
};
