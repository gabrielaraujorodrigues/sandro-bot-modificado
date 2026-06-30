const { readJSON, writeJSON } = require('../../lib/database');
module.exports = {
  name: 'antipalavrao', aliases: ['antipalavra', 'antipalavrão'],
  adminOnly: true, groupOnly: true,
  description: 'Ativa/desativa remoção de mensagens com palavrões (/antipalavrao on|off)',
  async execute(sock, { from, args }) {
    const modo = (args[0] || '').toLowerCase();
    const cfg = readJSON('antipalavrao', {});
    if (modo !== 'on' && modo !== 'off') {
      return sock.sendMessage(from, { text: `🤬 Anti-Palavrão: *${cfg[from] ? 'ATIVADO' : 'DESATIVADO'}*\nUse: /antipalavrao on ou /antipalavrao off` });
    }
    cfg[from] = modo === 'on';
    writeJSON('antipalavrao', cfg);
    await sock.sendMessage(from, { text: `✅ Anti-Palavrão ${modo === 'on' ? 'ATIVADO — mensagens com palavrões serão deletadas!' : 'DESATIVADO'}` });
  },
};
