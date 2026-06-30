const { readJSON, writeJSON } = require('../../lib/database');
module.exports = {
  name: 'antifig18', aliases: ['antinudez', 'antinsfw', 'anti18'],
  adminOnly: true, groupOnly: true,
  description: 'Ativa/desativa banimento automático por figurinha +18 (/antifig18 on|off)',
  async execute(sock, { from, args }) {
    const modo = (args[0] || '').toLowerCase();
    const cfg = readJSON('antifig18', {});
    if (modo !== 'on' && modo !== 'off') {
      return sock.sendMessage(from, { text: `🔞 Antifig18: *${cfg[from] ? 'ATIVADO' : 'DESATIVADO'}*\n\nQuando ativado, o bot detecta figurinhas com nudez/pornografia e bana automaticamente quem enviar.\n\nUse: /antifig18 on ou /antifig18 off\n\n⚠️ Requer nsfwjs instalado no servidor.` });
    }
    cfg[from] = modo === 'on';
    writeJSON('antifig18', cfg);
    await sock.sendMessage(from, { text: `✅ Antifig18 ${modo === 'on' ? '🔞 ATIVADO — figurinhas +18 serão detectadas e o usuário banido!' : '⭕ DESATIVADO'}` });
  },
};
