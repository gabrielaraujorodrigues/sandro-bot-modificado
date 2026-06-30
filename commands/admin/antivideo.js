const { readJSON, writeJSON } = require('../../lib/database');
module.exports = {
  name: 'antivideo',
  adminOnly: true, groupOnly: true,
  description: 'Ativa/desativa bloqueio de vídeos no grupo (/antivideo on|off)',
  async execute(sock, { from, args }) {
    const modo = (args[0] || '').toLowerCase();
    const cfg = readJSON('antivideo', {});
    if (modo !== 'on' && modo !== 'off') {
      return sock.sendMessage(from, { text: `🎬 Anti-Vídeo: *${cfg[from] ? 'ATIVADO' : 'DESATIVADO'}*\nUse: /antivideo on ou /antivideo off` });
    }
    cfg[from] = modo === 'on';
    writeJSON('antivideo', cfg);
    await sock.sendMessage(from, { text: `✅ Anti-Vídeo ${modo === 'on' ? 'ATIVADO — vídeos serão deletados!' : 'DESATIVADO'}` });
  },
};
