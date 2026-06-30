module.exports = {
  name: 'casal', aliases: ['casaldodia', 'casal2'],
  groupOnly: true,
  description: 'Sorteia o casal aleatório do grupo',
  async execute(sock, { from }) {
    try {
      const meta = await sock.groupMetadata(from);
      const membros = meta.participants.filter(p => !p.admin);
      if (membros.length < 2) return sock.sendMessage(from, { text: '❌ Precisa de pelo menos 2 membros não-admin!' });
      const idx1 = Math.floor(Math.random() * membros.length);
      let idx2;
      do { idx2 = Math.floor(Math.random() * membros.length); } while (idx2 === idx1);
      const p1 = membros[idx1].id, p2 = membros[idx2].id;
      const compat = Math.floor(Math.random() * 41) + 60; // 60-100%
      await sock.sendMessage(from, {
        text: `💑 *Casal do dia!*\n\n💕 @${p1.split('@')[0]}\n❤️ + ❤️\n💕 @${p2.split('@')[0]}\n\n💯 Compatibilidade: ${compat}%\n\n_${compat >= 90 ? 'Amor perfeito! 😍' : compat >= 75 ? 'Tem muito potencial! 💖' : 'Quem sabe... 😅'}_`,
        mentions: [p1, p2],
      });
    } catch (e) { await sock.sendMessage(from, { text: '❌ ' + e.message }); }
  },
};
