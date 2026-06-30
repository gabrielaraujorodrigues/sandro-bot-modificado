module.exports = {
  name: 'aleatorio', aliases: ['random', 'sorteio'],
  description: 'Sortear número ou opções (/aleatorio 100 | /aleatorio pizza ou hamburguer)',
  async execute(sock, { from, args }) {
    if (!args.length) {
      return sock.sendMessage(from, { text: `🎲 Número: *${Math.floor(Math.random() * 100) + 1}*\n\nUse:\n/aleatorio 500 — sorteia de 1 a 500\n/aleatorio pizza ou hamburguer — escolhe entre opções` });
    }
    const texto = args.join(' ');
    if (texto.includes(' ou ')) {
      const opcoes = texto.split(' ou ').map(o => o.trim()).filter(Boolean);
      const escolha = opcoes[Math.floor(Math.random() * opcoes.length)];
      return sock.sendMessage(from, { text: `🎯 *Sorteio de opções:*\n\n${opcoes.map((o, i) => `${i + 1}. ${o}`).join('\n')}\n\n✅ Escolhido: *${escolha}*` });
    }
    const max = parseInt(texto) || 100;
    await sock.sendMessage(from, { text: `🎲 Número de 1 a ${max}: *${Math.floor(Math.random() * max) + 1}*` });
  },
};
