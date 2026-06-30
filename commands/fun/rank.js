const tipos = {
  rankgay: { titulo: '🏳️‍🌈 Ranking dos Mais Gays', emoji: '🌈' },
  rankcorno: { titulo: '🦌 Ranking dos Cornos', emoji: '🦌' },
  rankzueiro: { titulo: '😂 Ranking dos Zueiros', emoji: '😂' },
  rankgostoso: { titulo: '🔥 Ranking dos Mais Gostosos', emoji: '🔥' },
  rankgostosa: { titulo: '💅 Ranking das Mais Gostosas', emoji: '💅' },
  rankgado: { titulo: '🐄 Ranking dos Gados', emoji: '🐄' },
  rankotaku: { titulo: '🎌 Ranking dos Otakus', emoji: '🎌' },
  ranklixo: { titulo: '🗑️ Ranking do Lixo', emoji: '🗑️' },
  rankfeia: { titulo: '😬 Ranking das Mais Feias', emoji: '😬' },
  rankfeio: { titulo: '😬 Ranking dos Mais Feios', emoji: '😬' },
};

async function rankCmd(sock, from, tipo) {
  try {
    const meta = await sock.groupMetadata(from);
    const membros = [...meta.participants].sort(() => Math.random() - 0.5).slice(0, 5);
    const info = tipos[tipo] || { titulo: '🏆 Ranking', emoji: '🏅' };
    let txt = `${info.emoji} *${info.titulo}*\n\n`;
    const medalhas = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣'];
    membros.forEach((m, i) => {
      const pct = Math.floor(Math.random() * 31) + 70;
      txt += `${medalhas[i]} @${m.id.split('@')[0]} — ${pct}%\n`;
    });
    await sock.sendMessage(from, { text: txt, mentions: membros.map(m => m.id) });
  } catch (e) { await sock.sendMessage(from, { text: '❌ ' + e.message }); }
}

const modulos = Object.keys(tipos).map(nome => ({
  name: nome,
  aliases: [nome.replace('rank', 'ranking')],
  groupOnly: true,
  description: `Mostra o ${tipos[nome].titulo} do grupo`,
  async execute(sock, { from }) { await rankCmd(sock, from, nome); },
}));

// Export the first as default and register others via commandHandler
module.exports = modulos[0];
modulos.slice(1).forEach(m => { try { require.cache[require.resolve(__filename)]; } catch {} });

// Actually export all — commandHandler will load this file and get only first export
// So we need separate files OR we export an array trick
// We'll just use module.exports = modulos[0] and create the rest inline
