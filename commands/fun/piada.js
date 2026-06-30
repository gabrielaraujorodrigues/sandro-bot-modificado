const fetch = require('node-fetch');

module.exports = {
  name: 'piada',
  aliases: ['joke', 'humor', 'risada'],
  description: 'Conta uma piada aleatória',
  async execute(sock, { from }) {
    try {
      const res = await fetch('https://v2.jokeapi.dev/joke/Programming,Misc?lang=pt&blacklistFlags=nsfw,racist,sexist');
      const data = await res.json();
      let texto;
      if (data.type === 'twopart') {
        texto = `😂 *Piada do dia:*\n\n${data.setup}\n\n||${data.delivery}||`;
      } else {
        texto = `😂 *Piada do dia:*\n\n${data.joke}`;
      }
      await sock.sendMessage(from, { text: texto });
    } catch {
      const piadas = [
        '😂 Por que o JavaScript foi ao médico?\nPorque tinha muito *callback*!',
        '😂 O que o oceano disse para a praia?\nNada, só acenou!',
        '😂 Por que o livro de matemática ficou triste?\nTinha muitos problemas!',
        '😂 Como se chama um burro que toca guitarra?\nUm jumento elétrico! 🎸',
      ];
      await sock.sendMessage(from, { text: piadas[Math.floor(Math.random() * piadas.length)] });
    }
  },
};
