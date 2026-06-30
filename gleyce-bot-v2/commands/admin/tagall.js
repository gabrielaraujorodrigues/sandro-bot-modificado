module.exports = {
  name: 'tagall',
  aliases: ['marcartodos', 'all'],
  adminOnly: true,
  groupOnly: true,
  description: 'Menciona todos os membros do grupo',
  async execute(sock, ctx) {
    const { from, args } = ctx;
    try {
      const meta = await sock.groupMetadata(from);
      const participantes = meta.participants.map((p) => p.id);
      const mensagemExtra = args.join(' ');
      let texto = `📢 *Atenção, todos!*\n\n${mensagemExtra ? mensagemExtra + '\n\n' : ''}`;
      texto += participantes.map((p) => `@${p.split('@')[0]}`).join(' ');
      await sock.sendMessage(from, { text: texto, mentions: participantes });
    } catch (e) {
      await sock.sendMessage(from, { text: '❌ Erro ao marcar membros: ' + e.message });
    }
  },
};
