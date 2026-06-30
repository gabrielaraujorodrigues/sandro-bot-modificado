const { readJSON, writeJSON } = require('../../lib/database');
module.exports = {
  name: 'anticontato',
  adminOnly: true, groupOnly: true,
  description: 'Ativa/desativa bloqueio de contatos compartilhados (/anticontato on|off)',
  async execute(sock, { from, args }) {
    const modo = (args[0] || '').toLowerCase();
    const cfg = readJSON('anticontato', {});
    if (modo !== 'on' && modo !== 'off') {
      return sock.sendMessage(from, { text: `👤 Anti-Contato: *${cfg[from] ? 'ATIVADO' : 'DESATIVADO'}*\nUse: /anticontato on ou /anticontato off` });
    }
    cfg[from] = modo === 'on';
    writeJSON('anticontato', cfg);
    await sock.sendMessage(from, { text: `✅ Anti-Contato ${modo === 'on' ? 'ATIVADO!' : 'DESATIVADO'}` });
  },
};
