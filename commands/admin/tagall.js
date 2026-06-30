module.exports = {
  name: 'tagall', aliases: ['marcartodos', 'all', '@all'],
  adminOnly: true, groupOnly: true,
  description: 'Menciona todos os membros do grupo',
  async execute(sock, { from, args }) {
    try {
      const meta = await sock.groupMetadata(from);
      const todos = meta.participants.map((p) => p.id);
      const extra = args.join(' ');
      let txt = `📢 *Atenção, todos!*\n\n${extra ? extra + '\n\n' : ''}`;
      txt += todos.map((p) => `@${p.split('@')[0]}`).join(' ');
      await sock.sendMessage(from, { text: txt, mentions: todos });
    } catch (e) {
      await sock.sendMessage(from, { text: '❌ Erro ao marcar membros: ' + e.message });
    }
  },
};
