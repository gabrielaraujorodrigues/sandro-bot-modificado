module.exports = {
  name: 'ranklixo',
  groupOnly: true,
  description: 'Mostra o 🗑️ Ranking do Lixo do grupo',
  async execute(sock, { from }) {
    try {
      const meta = await sock.groupMetadata(from);
      const membros = [...meta.participants].sort(() => Math.random() - 0.5).slice(0, 5);
      const medalhas = ['🥇','🥈','🥉','4️⃣','5️⃣'];
      let txt = '🗑️ Ranking do Lixo\n\n';
      membros.forEach((m, i) => {
        const pct = Math.floor(Math.random() * 31) + 70;
        txt += medalhas[i] + ' @' + m.id.split('@')[0] + ' — ' + pct + '%\n';
      });
      await sock.sendMessage(from, { text: txt, mentions: membros.map(m => m.id) });
    } catch (e) { await sock.sendMessage(from, { text: '❌ ' + e.message }); }
  },
};
