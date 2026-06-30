const { readJSON, writeJSON } = require('../../lib/database');
module.exports = {
  name: 'antiimg', aliases: ['antiimagem'],
  adminOnly: true, groupOnly: true,
  description: 'Ativa/desativa bloqueio de imagens no grupo (/antiimg on|off)',
  async execute(sock, { from, args }) {
    const modo = (args[0] || '').toLowerCase();
    const cfg = readJSON('antiimg', {});
    if (modo !== 'on' && modo !== 'off') {
      return sock.sendMessage(from, { text: `🖼️ Anti-Imagem: *${cfg[from] ? 'ATIVADO' : 'DESATIVADO'}*\nUse: /antiimg on ou /antiimg off` });
    }
    cfg[from] = modo === 'on';
    writeJSON('antiimg', cfg);
    await sock.sendMessage(from, { text: `✅ Anti-Imagem ${modo === 'on' ? 'ATIVADO — imagens serão deletadas!' : 'DESATIVADO'}` });
  },
};
