const { getAgendamentos } = require('../../lib/scheduler');

module.exports = {
  name: 'agendamentos',
  aliases: ['listarag', 'horarios'],
  groupOnly: true,
  description: 'Lista os agendamentos de abrir/fechar do grupo',
  async execute(sock, ctx) {
    const { from, prefix } = ctx;
    const lista = getAgendamentos(from);

    if (!lista || lista.length === 0) {
      await sock.sendMessage(from, {
        text:
          `📋 *Agendamentos deste grupo:*\n\nNenhum agendamento ativo no momento.\n\n` +
          `Use:\n• ${prefix}abrir HH:MM ou ${prefix}abrir 2h\n• ${prefix}fechar HH:MM ou ${prefix}fechar 30m`,
      });
      return;
    }

    let texto = `📋 *Agendamentos deste grupo:*\n\n`;
    lista.forEach((item, i) => {
      const tipo = item.tipo === 'open' ? '🔓 ABRIR' : '🔒 FECHAR';
      const restante = Math.max(0, Math.round((item.executarEm - Date.now()) / 60000));
      texto += `${i + 1}. ${tipo} — em ~${restante} min\n   ID: \`${item.id}\`\n\n`;
    });
    texto += `Para cancelar: ${prefix}cancelarag <ID>`;

    await sock.sendMessage(from, { text: texto });
  },
};
