const { readJSON, writeJSON } = require('../../lib/database');
module.exports = {
  name: 'antidoc', aliases: ['antidocumento'],
  adminOnly: true, groupOnly: true,
  description: 'Ativa/desativa bloqueio de documentos no grupo (/antidoc on|off)',
  async execute(sock, { from, args }) {
    const modo = (args[0] || '').toLowerCase();
    const cfg = readJSON('antidoc', {});
    if (modo !== 'on' && modo !== 'off') {
      return sock.sendMessage(from, { text: `📄 Anti-Documento: *${cfg[from] ? 'ATIVADO' : 'DESATIVADO'}*\nUse: /antidoc on ou /antidoc off` });
    }
    cfg[from] = modo === 'on';
    writeJSON('antidoc', cfg);
    await sock.sendMessage(from, { text: `✅ Anti-Documento ${modo === 'on' ? 'ATIVADO!' : 'DESATIVADO'}` });
  },
};
