const { cancelarAgendamento } = require('../../lib/scheduler');

module.exports = {
  name: 'cancelarag',
  aliases: ['removerag', 'deletarag'],
  adminOnly: true,
  groupOnly: true,
  description: 'Cancela um agendamento pelo ID',
  async execute(sock, ctx) {
    const { from, args, prefix } = ctx;
    const id = args[0];

    if (!id) {
      await sock.sendMessage(from, {
        text: `❌ Informe o ID do agendamento.\n\nUse *${prefix}agendamentos* para ver os IDs.`,
      });
      return;
    }

    const ok = cancelarAgendamento(from, id);
    await sock.sendMessage(from, {
      text: ok ? `✅ Agendamento \`${id}\` cancelado com sucesso!` : `❌ Agendamento com ID \`${id}\` não encontrado!`,
    });
  },
};
