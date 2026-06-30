const { readJSON, writeJSON } = require('../../lib/database');
module.exports = {
  name: 'bemvindo', aliases: ['welcome', 'boasvindas'],
  adminOnly: true, groupOnly: true,
  description: 'Ativa/desativa mensagem de boas-vindas (/bemvindo on|off)',
  async execute(sock, { from, args }) {
    const modo = (args[0] || '').toLowerCase();
    const config = readJSON('bemvindo', {});
    if (modo !== 'on' && modo !== 'off') {
      return sock.sendMessage(from, { text: `👋 Boas-vindas: *${config[from] ? 'ATIVADO' : 'DESATIVADO'}*\nUse /bemvindo on ou /bemvindo off` });
    }
    config[from] = modo === 'on';
    writeJSON('bemvindo', config);
    await sock.sendMessage(from, { text: `✅ Boas-vindas ${modo === 'on' ? 'ativado' : 'desativado'}!` });
  },
};
