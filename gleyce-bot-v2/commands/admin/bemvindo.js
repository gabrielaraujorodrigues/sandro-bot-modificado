const { readJSON, writeJSON } = require('../../lib/database');

module.exports = {
  name: 'bemvindo',
  aliases: ['welcome', 'boasvindas'],
  adminOnly: true,
  groupOnly: true,
  description: 'Ativa/desativa mensagem de boas-vindas (ex: /bemvindo on)',
  async execute(sock, ctx) {
    const { from, args } = ctx;
    const modo = (args[0] || '').toLowerCase();
    const config = readJSON('bemvindo', {});

    if (modo !== 'on' && modo !== 'off') {
      const status = config[from] ? 'ATIVADO' : 'DESATIVADO';
      await sock.sendMessage(from, { text: `👋 Boas-vindas está atualmente *${status}*.\n\nUse /bemvindo on ou /bemvindo off.` });
      return;
    }

    config[from] = modo === 'on';
    writeJSON('bemvindo', config);
    await sock.sendMessage(from, { text: `✅ Boas-vindas ${modo === 'on' ? 'ativado' : 'desativado'} com sucesso!` });
  },
};
