const { readJSON, writeJSON } = require('../../lib/database');

module.exports = {
  name: 'antilink',
  aliases: [],
  adminOnly: true,
  groupOnly: true,
  description: 'Ativa/desativa remoção automática de links (ex: /antilink on)',
  async execute(sock, ctx) {
    const { from, args } = ctx;
    const modo = (args[0] || '').toLowerCase();
    const config = readJSON('antilink', {});

    if (modo !== 'on' && modo !== 'off') {
      const status = config[from] ? 'ATIVADO' : 'DESATIVADO';
      await sock.sendMessage(from, { text: `🔗 Antilink está atualmente *${status}*.\n\nUse /antilink on ou /antilink off.` });
      return;
    }

    config[from] = modo === 'on';
    writeJSON('antilink', config);
    await sock.sendMessage(from, { text: `✅ Antilink ${modo === 'on' ? 'ativado' : 'desativado'} com sucesso!` });
  },
};
