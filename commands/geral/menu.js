const { listarComandos } = require('../../lib/commandHandler');
module.exports = {
  name: 'menu', aliases: ['help', 'ajuda', 'comandos', 'cmd'],
  description: 'Mostra todos os comandos disponíveis',
  async execute(sock, { from, prefix, settings }) {
    const cmds = listarComandos();
    const cats = {};
    for (const c of cmds) { if (!cats[c.category]) cats[c.category] = []; cats[c.category].push(c); }
    const nomes = { geral: '🌐 GERAL', admin: '🛡️ ADMINISTRAÇÃO', owner: '👑 DONO', fun: '🎉 DIVERSÃO' };
    let txt = `╭─────────────────────╮\n│  *${settings.nomeDoBot}*\n╰─────────────────────╯\n\n👤 Dono: ${settings.nickDono}\n📌 Prefixo: *${prefix}*\n`;
    for (const [cat, lista] of Object.entries(cats)) {
      txt += `\n*${nomes[cat] || cat.toUpperCase()}*\n`;
      for (const c of lista) txt += `▸ ${prefix}${c.name} — ${c.description || ''}\n`;
    }
    txt += `\n_${settings.nomeDoBot} — funcionando 100% 🤖_`;
    await sock.sendMessage(from, { text: txt });
  },
};
