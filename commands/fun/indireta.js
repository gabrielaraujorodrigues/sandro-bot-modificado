const indiretas = [
  'Tem gente que fala tanto da vida dos outros porque a própria não tem graça nenhuma 🙄',
  'Falsidade não é defeito, é um estilo de vida mesmo 🤷',
  'Tem gente que sorri pra você na frente e reza contra por trás 💀',
  'Deus criou o mundo em 6 dias e descansou no 7°. Fingidos não descansam nunca 😈',
  'Prefiro ser odiada por quem sou do que amada por quem não sou 💅',
  'Gente falsa é como nota falsa: todo mundo tenta passar, ninguém quer ficar com ela 🚫',
  'Você não está errada, está apenas com dificuldades para entender o óbvio 😌',
  'Algumas pessoas chegam na sua vida como uma bênção, outras como uma lição 🌚',
  'Sabe aquela pessoa que some quando você precisa e aparece quando é conveniente? Boa reflexão 👀',
  'Quem fofoca pra você, fofoca de você. Pensa nisso 🤫',
  'A língua não tem osso mas quebra osso. Cuidado com o que fala sobre os outros 🦴',
];

module.exports = {
  name: 'indireta', aliases: ['indiretas', 'recado'],
  description: 'Envia uma indireta aleatória 😤',
  async execute(sock, { from }) {
    const i = indiretas[Math.floor(Math.random() * indiretas.length)];
    await sock.sendMessage(from, { text: `🔥 *Indireta do dia:*\n\n_${i}_` });
  },
};
