const { cancelarAgendamento } = require('../../lib/scheduler');
module.exports = {
  name: 'cancelarag', aliases: ['removerag'],
  adminOnly: true, groupOnly: true,
  description: 'Cancela agendamento pelo ID (ex: /cancelarag 010124122530)',
  async execute(sock, { from, args, prefix }) {
    const id = args[0];
    if (!id) return sock.sendMessage(from, { text: `❌ Informe o ID. Use *${prefix}agendamentos* para ver.` });
    const ok = cancelarAgendamento(from, id);
    await sock.sendMessage(from, { text: ok ? `✅ Agendamento \`${id}\` cancelado!` : `❌ ID \`${id}\` não encontrado.` });
  },
};
