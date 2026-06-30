const frases = [
  'Você tem cara de quem acredita em horóscopo e ainda erra a previsão 💅',
  'Vai viver! Mas assim, vive lá longe mesmo 🙄',
  'Você é a prova viva de que nem todo mundo deveria ter acesso à internet 📱',
  'Sabe aquela pessoa que faz barulho e não faz nada? Exatamente 😌',
  'Cara de paisagem de fundo de tela — bonito mas inútil 💁',
  'Você tá aqui tomando espaço que podia ser de alguém mais inteligente 🧠',
  'Deus criou as pessoas, mas parece que esqueceu de revisar alguns modelos 😂',
  'Minha paciência acabou, mas felizmente sua existência também vai acabar... de me irritar 💀',
  'Você é tipo Wi-Fi em área rural — presente mas completamente inútil 📡',
  'Sorri porque não vale a pena te dar atenção 😊',
];
module.exports = {
  name: 'deboche', aliases: ['zoar', 'ironia'],
  description: 'Envia uma frase de deboche 😏',
  async execute(sock, { from }) {
    const f = frases[Math.floor(Math.random() * frases.length)];
    await sock.sendMessage(from, { text: `😏 *Deboche do dia:*\n\n_${f}_` });
  },
};
