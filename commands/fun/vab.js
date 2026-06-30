const perguntas = [
  'Você prefere ser rico ou famoso?','Você prefere ficar sem internet ou sem sair de casa por 1 mês?',
  'Você prefere ter super força ou super velocidade?','Você prefere morar na praia ou no campo?',
  'Você prefere comer pizza todos os dias ou nunca mais comer pizza?',
  'Você prefere ter memória perfeita ou ser muito criativo?',
  'Você prefere viver 200 anos pobre ou 50 anos milionário?',
  'Você prefere não ter celular ou não ter TV por 1 ano?',
  'Você prefere falar a verdade sempre ou mentir sempre?',
  'Você prefere ter cabelo cor-de-rosa ou azul para sempre?',
];
module.exports = {
  name: 'vab', aliases: ['voceprefere', 'preferencia'],
  description: 'Você prefere? — dilema aleatório',
  async execute(sock, { from }) {
    const p = perguntas[Math.floor(Math.random() * perguntas.length)];
    await sock.sendMessage(from, { text: `🤔 *Você prefere?*\n\n${p}` });
  },
};
