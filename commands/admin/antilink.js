const { readJSON, writeJSON } = require('../../lib/database');
module.exports = {
  name: 'antilink', aliases: [],
  adminOnly: true, groupOnly: true,
  description: 'Ativa/desativa remoção automática de links (/antilink on|off)',
  async execute(sock, { from, args }) {
    const modo = (args[0] || '').toLowerCase();
    const config = readJSON('antilink', {});
    if (modo !== 'on' && modo !== 'off') {
      return sock.sendMessage(from, { text: `🔗 Antilink: *${config[from] ? 'ATIVADO' : 'DESATIVADO'}*\nUse /antilink on ou /antilink off` });
    }
    config[from] = modo === 'on';
    writeJSON('antilink', config);
    await sock.sendMessage(from, { text: `✅ Antilink ${modo === 'on' ? 'ativado' : 'desativado'}!` });
  },
};
