const { readJSON, writeJSON } = require('../../lib/database');
module.exports = {
  name: 'antisticker', aliases: ['antifig'],
  adminOnly: true, groupOnly: true,
  description: 'Ativa/desativa bloqueio de todas as figurinhas (/antisticker on|off)',
  async execute(sock, { from, args }) {
    const modo = (args[0] || '').toLowerCase();
    const cfg = readJSON('antisticker', {});
    if (modo !== 'on' && modo !== 'off') {
      return sock.sendMessage(from, { text: `🎭 Anti-Sticker: *${cfg[from] ? 'ATIVADO' : 'DESATIVADO'}*\nUse: /antisticker on ou /antisticker off\n\n💡 Para bloquear só figurinhas +18, use /antifig18` });
    }
    cfg[from] = modo === 'on';
    writeJSON('antisticker', cfg);
    await sock.sendMessage(from, { text: `✅ Anti-Sticker ${modo === 'on' ? 'ATIVADO — todas as figurinhas serão deletadas!' : 'DESATIVADO'}` });
  },
};
