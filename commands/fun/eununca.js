const frases = [
  'Eu nunca fui a um show de rock','Eu nunca dormi mais de 12 horas seguidas',
  'Eu nunca joguei videogame a noite toda','Eu nunca menti para um professor',
  'Eu nunca comi pizza na madrugada','Eu nunca perdi meu celular',
  'Eu nunca fui a uma festa fantasiado','Eu nunca chorei assistindo a um filme',
  'Eu nunca me perdi em uma cidade desconhecida','Eu nunca cozinhei uma refeição completa',
  'Eu nunca pulei aula','Eu nunca tive medo de palhaço',
];
module.exports = {
  name: 'eununca', aliases: ['nunca', 'jogo'],
  description: 'Eu nunca, eu já — frase aleatória',
  async execute(sock, { from }) {
    const f = frases[Math.floor(Math.random() * frases.length)];
    await sock.sendMessage(from, { text: `👆 *Eu nunca...*\n\n${f}\n\nResponda se você já fez isso! 😁` });
  },
};
