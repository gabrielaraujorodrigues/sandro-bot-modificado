const jogos = {};
module.exports = {
  name: 'adivinha', aliases: ['adivinhanumero'],
  description: 'Jogo de adivinhar número (ex: /adivinha 50)',
  async execute(sock, { from, args, sender }) {
    const key = from + sender;
    if (!jogos[key]) {
      const n = Math.floor(Math.random() * 100) + 1;
      jogos[key] = { n, tentativas: 0 };
      return sock.sendMessage(from, { text: '🎯 *Jogo da Adivinha!*\n\nEscolhi um número de 1 a 100.\nUse /adivinha <número> para chutar!\n\nEx: /adivinha 50' });
    }
    const chute = parseInt(args[0]);
    if (isNaN(chute)) return sock.sendMessage(from, { text: '❌ Digite um número válido. Ex: /adivinha 50' });
    jogos[key].tentativas++;
    const { n, tentativas } = jogos[key];
    if (chute === n) {
      delete jogos[key];
      return sock.sendMessage(from, { text: `🎉 *Parabéns!* Você acertou o número *${n}* em ${tentativas} tentativa(s)! 🏆` });
    }
    if (tentativas >= 10) {
      const num = n; delete jogos[key];
      return sock.sendMessage(from, { text: `💀 *Game over!* O número era *${num}*. Tente novamente com /adivinha!` });
    }
    const dica = chute < n ? '⬆️ É maior!' : '⬇️ É menor!';
    await sock.sendMessage(from, { text: `${dica} Tentativa ${tentativas}/10. Chute de novo!` });
  },
};
