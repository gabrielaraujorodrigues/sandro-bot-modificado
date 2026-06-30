const { readJSON, writeJSON } = require('../../lib/database');
module.exports = {
  name: 'antiaudio', aliases: ['antiptt'],
  adminOnly: true, groupOnly: true,
  description: 'Ativa/desativa bloqueio de áudios no grupo (/antiaudio on|off)',
  async execute(sock, { from, args }) {
    const modo = (args[0] || '').toLowerCase();
    const cfg = readJSON('antiaudio', {});
    if (modo !== 'on' && modo !== 'off') {
      return sock.sendMessage(from, { text: `🔊 Anti-Áudio: *${cfg[from] ? 'ATIVADO' : 'DESATIVADO'}*\nUse: /antiaudio on ou /antiaudio off` });
    }
    cfg[from] = modo === 'on';
    writeJSON('antiaudio', cfg);
    await sock.sendMessage(from, { text: `✅ Anti-Áudio ${modo === 'on' ? 'ATIVADO — áudios serão deletados!' : 'DESATIVADO'}` });
  },
};
