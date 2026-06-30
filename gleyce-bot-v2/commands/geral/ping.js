module.exports = {
  name: 'ping',
  aliases: ['p'],
  description: 'Mostra a velocidade de resposta do bot',
  async execute(sock, ctx) {
    const { from } = ctx;
    const inicio = Date.now();
    const sent = await sock.sendMessage(from, { text: '🏓 Calculando...' });
    const tempo = Date.now() - inicio;
    await sock.sendMessage(from, { text: `🏓 *Pong!*\n⚡ Velocidade: ${tempo}ms` }, { quoted: sent });
  },
};
