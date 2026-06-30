module.exports = {
  name: 'ping', aliases: ['p'],
  description: 'Testa a velocidade de resposta do bot',
  async execute(sock, { from }) {
    const t = Date.now();
    const sent = await sock.sendMessage(from, { text: '🏓 Calculando...' });
    await sock.sendMessage(from, { text: `🏓 *Pong!*\n⚡ Velocidade: ${Date.now() - t}ms` }, { quoted: sent });
  },
};
