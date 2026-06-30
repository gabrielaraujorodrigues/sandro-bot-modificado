const { getAgendamentos } = require('../../lib/scheduler');
module.exports = {
  name: 'agendamentos', aliases: ['listarag', 'horarios'],
  groupOnly: true,
  description: 'Lista agendamentos de abrir/fechar do grupo',
  async execute(sock, { from, prefix }) {
    const lista = getAgendamentos(from);
    if (!lista?.length) return sock.sendMessage(from, { text: `📋 Nenhum agendamento ativo.\n\nExemplos:\n${prefix}abrir 22:00\n${prefix}fechar 30m` });
    let txt = `📋 *Agendamentos ativos:*\n\n`;
    lista.forEach((item, i) => {
      const tipo = item.tipo === 'open' ? '🔓 ABRIR' : '🔒 FECHAR';
      const min = Math.max(0, Math.round((item.executarEm - Date.now()) / 60000));
      txt += `${i + 1}. ${tipo} em ~${min} min\n   ID: \`${item.id}\`\n\n`;
    });
    await sock.sendMessage(from, { text: txt.trim() });
  },
};
