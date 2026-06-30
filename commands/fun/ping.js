module.exports = {
  name: 'ping', aliases: ['velocidade', 'latencia', 'bot'],
  description: 'Testa a velocidade de resposta do bot',
  async execute(sock, { from, settings }) {
    const inicio = Date.now();
    const msg = await sock.sendMessage(from, { text: '🏓 Calculando...' });
    const ms = Date.now() - inicio;
    const status = ms < 300 ? '🟢 Ótimo' : ms < 700 ? '🟡 Normal' : '🔴 Lento';
    await sock.sendMessage(from, {
      text: `🏓 *Pong!*\n\n⚡ Latência: ${ms}ms\n📊 Status: ${status}\n🤖 Bot: ${settings.nomeDoBot}\n✅ Operacional!`,
    });
  },
};
