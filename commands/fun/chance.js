module.exports = {
  name: 'chance', aliases: ['porcentagem', 'prob'],
  description: 'Calcula a chance de algo acontecer (ex: /chance eu passar na prova)',
  async execute(sock, { from, args }) {
    const coisa = args.join(' ') || 'isso acontecer';
    const pct = Math.floor(Math.random() * 101);
    const bar = '█'.repeat(Math.round(pct/10)) + '░'.repeat(10 - Math.round(pct/10));
    const msg = pct > 80 ? '🟢 Muito provável!' : pct > 50 ? '🟡 Talvez...' : pct > 20 ? '🟠 Pouco provável' : '🔴 Quase impossível!';
    await sock.sendMessage(from, { text: `🎯 *Calculando a chance de...*\n\n"${coisa}"\n\n[${bar}] ${pct}%\n\n${msg}` });
  },
};
