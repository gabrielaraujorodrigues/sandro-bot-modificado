module.exports = {
  name: 'info',
  aliases: ['sobre', 'about'],
  description: 'Informações sobre o bot',
  async execute(sock, ctx) {
    const { from, settings } = ctx;
    await sock.sendMessage(from, {
      text:
        `🩷 *${settings.nomeDoBot}*\n\n` +
        `👤 Dono: ${settings.nickDono}\n` +
        `⚙️ Construído com Baileys (biblioteca oficial)\n` +
        `🔧 Versão: 2.0 — reconstruído do zero\n\n` +
        `Digite *${settings.prefix}menu* para ver os comandos.`,
    });
  },
};
