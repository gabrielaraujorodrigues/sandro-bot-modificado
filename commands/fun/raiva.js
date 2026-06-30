const frases = [
  'Eu estou bem. (Não estou.) 😤','Respira fundo... e continua com raiva mesmo 😠',
  'Às vezes a pessoa te irrita tanto que você quer ligar o modo silencioso... nela 🔇',
  'Calma, calma... Tá, não deu 💢','Gente grossa é como pedra no sapato — você sente até tirar 👟',
  'Quando alguém fala "calma" eu fico ainda mais nervosa 😡',
  'O problema não é ter raiva. O problema é que eu tenho razão e eles não reconhecem 😤',
  'Respirei fundo. Não funcionou. Parti pro plano B 😈',
];
module.exports = {
  name: 'raiva', aliases: ['nervosa', 'irritada'],
  description: 'Frase de raiva para desabafar 😡',
  async execute(sock, { from }) {
    const f = frases[Math.floor(Math.random() * frases.length)];
    await sock.sendMessage(from, { text: `😡 *Raiva do dia:*\n\n_${f}_` });
  },
};
