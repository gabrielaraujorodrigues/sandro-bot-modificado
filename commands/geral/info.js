module.exports = {
  name: 'info', aliases: ['sobre', 'about', 'botinfo'],
  description: 'Informações sobre o bot',
  async execute(sock, { from, settings }) {
    const uptime = process.uptime();
    const h = Math.floor(uptime / 3600);
    const m = Math.floor((uptime % 3600) / 60);
    const s = Math.floor(uptime % 60);
    await sock.sendMessage(from, {
      text: `🤖 *Informações do Bot*\n\n╔♡∞*♡♡∞:｡.｡🩷｡.｡:∞♡*♡:∞♡╗\n\n🩷 Nome: ${settings.nomeDoBot}\n🧚‍♀️ Versão: 2.0\n🩷 Biblioteca: Baileys\n🧚‍♀️ Runtime: Node.js ${process.version}\n🩷 Uptime: ${h}h ${m}m ${s}s\n🧚‍♀️ Dono: ${settings.nickDono}\n🩷 Prefixo: /${' '}!\n\n╚♡∞*♡♡∞:｡.｡🩷｡.｡:∞♡*♡:∞♡╝`,
    });
  },
};
