module.exports = {
  name: 'infodono', aliases: ['dono', 'owner', 'contato', 'criador'],
  description: 'Informações de contato do dono do bot',
  async execute(sock, { from, settings, msg }) {
    await sock.sendMessage(from, {
      text: `👑 *Informações do Dono*\n\n🩷 Nome: ${settings.nickDono}\n🧚‍♀️ Bot: ${settings.nomeDoBot}\n🩷 Número: +${settings.numeroDono}\n🧚‍♀️ Biblioteca: Baileys (WhatsApp)\n\n_Entre em contato pelo número acima para dúvidas, sugestões ou suporte._ 💖`,
    }, { quoted: msg });
  },
};
