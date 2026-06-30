module.exports = {
  name: 'dado',
  aliases: ['dice', 'rolar', 'sorteio'],
  description: 'Rola um dado (ex: /dado 6 para d6, /dado 100 para percentual)',
  async execute(sock, { from, args }) {
    const lados = parseInt(args[0]) || 6;
    if (lados < 2 || lados > 1000) return sock.sendMessage(from, { text: '❌ O dado deve ter entre 2 e 1000 lados.' });
    const resultado = Math.floor(Math.random() * lados) + 1;
    const emoji = resultado === lados ? '🎯' : resultado === 1 ? '💀' : '🎲';
    await sock.sendMessage(from, {
      text: `${emoji} *Dado d${lados}*\n\nResultado: *${resultado}* ${resultado === lados ? '(máximo! 🏆)' : resultado === 1 ? '(mínimo 😬)' : ''}`,
    });
  },
};
