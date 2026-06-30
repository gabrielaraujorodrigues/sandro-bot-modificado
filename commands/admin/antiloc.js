const { readJSON, writeJSON } = require('../../lib/database');
module.exports = {
  name: 'antiloc', aliases: ['antilocalização'],
  adminOnly: true, groupOnly: true,
  description: 'Ativa/desativa bloqueio de localização no grupo (/antiloc on|off)',
  async execute(sock, { from, args }) {
    const modo = (args[0] || '').toLowerCase();
    const cfg = readJSON('antiloc', {});
    if (modo !== 'on' && modo !== 'off') {
      return sock.sendMessage(from, { text: `📍 Anti-Localização: *${cfg[from] ? 'ATIVADO' : 'DESATIVADO'}*\nUse: /antiloc on ou /antiloc off` });
    }
    cfg[from] = modo === 'on';
    writeJSON('antiloc', cfg);
    await sock.sendMessage(from, { text: `✅ Anti-Localização ${modo === 'on' ? 'ATIVADO!' : 'DESATIVADO'}` });
  },
};
