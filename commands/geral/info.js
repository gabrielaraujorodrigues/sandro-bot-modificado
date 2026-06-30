module.exports = {
  name: 'info', aliases: ['sobre', 'about', 'bot'],
  description: 'Informações sobre o bot',
  async execute(sock, { from, settings, prefix }) {
    await sock.sendMessage(from, {
      text: `🤖 *${settings.nomeDoBot}*\n\n👤 Dono: ${settings.nickDono}\n⚙️ Biblioteca: @whiskeysockets/baileys\n🔧 Versão: 2.0\n📌 Prefixo: ${prefix}\n\nDigite *${prefix}menu* para ver os comandos.`,
    });
  },
};
