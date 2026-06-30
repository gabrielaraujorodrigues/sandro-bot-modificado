module.exports = {
  name: 'bola8',
  aliases: ['8ball', 'magiball', 'previsao'],
  description: 'A bola mágica responde sua pergunta (ex: /bola8 Vou passar na prova?)',
  async execute(sock, { from, args }) {
    if (!args.length) return sock.sendMessage(from, { text: '❌ Faça uma pergunta! Ex: /bola8 Vou passar na prova?' });
    const respostas = [
      '🟢 Com certeza!', '🟢 Definitivamente sim!', '🟢 Pode apostar que sim!',
      '🟢 Sem dúvida alguma!', '🟢 Os sinais apontam que sim!',
      '🟡 Talvez...', '🟡 Não está claro agora, tente novamente.', '🟡 É difícil dizer...',
      '🔴 Não conte com isso.', '🔴 Definitivamente não!', '🔴 Minha visão diz não.',
      '🔴 As perspectivas não são boas.', '🔴 Não desta vez!',
    ];
    const r = respostas[Math.floor(Math.random() * respostas.length)];
    await sock.sendMessage(from, {
      text: `🎱 *Bola Mágica*\n\n❓ ${args.join(' ')}\n\n${r}`,
    });
  },
};
