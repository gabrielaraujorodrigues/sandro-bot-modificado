const { listarComandos } = require('../../lib/commandHandler');

module.exports = {
  name: 'menu',
  aliases: ['help', 'ajuda', 'comandos'],
  description: 'Mostra o menu de comandos',
  async execute(sock, ctx) {
    const { from, prefix, settings } = ctx;
    const comandos = listarComandos();

    const categorias = {};
    for (const cmd of comandos) {
      if (!categorias[cmd.category]) categorias[cmd.category] = [];
      categorias[cmd.category].push(cmd);
    }

    const nomesCategorias = {
      geral: '🩷 GERAL',
      admin: '🛡️ ADMINISTRAÇÃO',
      owner: '👑 DONO',
      fun: '🎉 DIVERSÃO',
    };

    let texto = `╭───────────────╮\n│  *${settings.nomeDoBot}*\n╰───────────────╯\n\n`;
    texto += `👤 Dono: ${settings.nickDono}\n📌 Prefixo: *${prefix}*\n\n`;

    for (const [cat, lista] of Object.entries(categorias)) {
      texto += `\n*${nomesCategorias[cat] || cat.toUpperCase()}*\n`;
      for (const cmd of lista) {
        texto += `▸ ${prefix}${cmd.name} — ${cmd.description || ''}\n`;
      }
    }

    texto += `\n_Gleyce Bot Oficial — reconstruído do zero 🩷_`;

    await sock.sendMessage(from, { text: texto });
  },
};
