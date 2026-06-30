const frases = [
  'Acredite em você mesmo e chegará um dia em que os outros não terão escolha a não ser acreditar também. — Cynthia Kersey 🌟',
  'O sucesso é a soma de pequenos esforços repetidos dia após dia. — Robert Collier 💪',
  'Não espere por uma crise para descobrir o que é importante na sua vida. — Platão 🔥',
  'A diferença entre o possível e o impossível está na vontade. — Tommy Lasorda ⚡',
  'Você não precisa ser grande para começar, mas precisa começar para ser grande. 🚀',
  'Cada dia é uma nova chance de mudar sua vida. ✨',
  'Sonhos não funcionam a menos que você trabalhe. — John C. Maxwell 💼',
  'Caia sete vezes, levante-se oito. — Provérbio Japonês 🗡️',
  'A vida é 10% o que nos acontece e 90% como reagimos a isso. — Charles Swindoll 🎯',
  'O único lugar onde o sucesso vem antes do trabalho é no dicionário. — Albert Einstein 📚',
  'Não desista. O começo é sempre o mais difícil. 💎',
  'Você é mais corajoso do que acredita, mais forte do que parece e mais inteligente do que pensa. — A.A. Milne 🦁',
];

module.exports = {
  name: 'motivacional', aliases: ['motivacao', 'motivação', 'frase'],
  description: 'Envia uma frase motivacional 💪',
  async execute(sock, { from }) {
    const f = frases[Math.floor(Math.random() * frases.length)];
    await sock.sendMessage(from, { text: `✨ *Frase do dia:*\n\n_${f}_` });
  },
};
