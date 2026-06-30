const frases = [
  'Amar é encontrar na felicidade de outro a própria felicidade. — Leibniz 💖',
  'O amor não se explica, se sente. 🌹',
  'Você é o motivo do meu sorriso mesmo nos dias mais difíceis. 💕',
  'Amar alguém é querer que essa pessoa seja feliz, mesmo que não seja com você. 🥺',
  'O amor é a única coisa que cresce quando é compartilhada. 💞',
  'Quando o amor é real, ele encontra um jeito. 💗',
  'Você me faz querer ser uma pessoa melhor. 🌸',
  'O amor verdadeiro não tem fim, apenas começos. ❤️',
  'Às vezes o coração vê o que os olhos não conseguem. 👁️',
  'Não existe lógica no amor, apenas emoção. 💓',
  'O amor é a maior aventura da vida. 🌟',
];

module.exports = {
  name: 'fraseamor', aliases: ['amor', 'frasedeamor', 'romance'],
  description: 'Envia uma frase de amor 🌹',
  async execute(sock, { from }) {
    const f = frases[Math.floor(Math.random() * frases.length)];
    await sock.sendMessage(from, { text: `💖 *Frase de amor:*\n\n_${f}_` });
  },
};
