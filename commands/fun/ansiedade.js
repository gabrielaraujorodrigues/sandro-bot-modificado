const frases = [
  'Meu cérebro às 3 da manhã: E se aquela coisa constrangedora de 2015 voltar a acontecer? 😰',
  'A ansiedade é quando você preocupa com coisas que ainda não aconteceram E com coisas que já passaram ao mesmo tempo 🌀',
  'Meu coração disparou porque olhei a hora errada 💓',
  'Eu: vou dormir cedo hoje\nMeu cérebro às 2am: LEMBRA QUANDO VOCÊ FEZ AQUILO EM 2012? 🧠',
  'Nada como uma boa e velha crise de ansiedade para lembrar que você está vivo 😅',
  'O botão de pânico no meu cérebro está quebrado — fica travado no ON 🔴',
  'Preocupação: quando você pensa em todos os jeitos que as coisas podem dar errado antes de tentá-las 😶',
  'Minha mente está em paz... Agora brincando — está um caos 🤯',
];
module.exports = {
  name: 'ansiedade', aliases: ['ansiosa', 'ansioso'],
  description: 'Frase sobre ansiedade (é quase terapia 😅)',
  async execute(sock, { from }) {
    const f = frases[Math.floor(Math.random() * frases.length)];
    await sock.sendMessage(from, { text: `😰 *Ansiedade do dia:*\n\n_${f}_` });
  },
};
