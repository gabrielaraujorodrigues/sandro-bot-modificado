module.exports = {
  name: 'cassino', aliases: ['slot', 'roleta'],
  description: 'Jogue no caça-níqueis! 🎰',
  async execute(sock, { from, sender }) {
    const simbolos = ['🍒','🍋','🍇','⭐','💎','7️⃣','🎰','🍀'];
    const r = () => simbolos[Math.floor(Math.random() * simbolos.length)];
    const s1 = r(), s2 = r(), s3 = r();
    const ganhou = s1 === s2 && s2 === s3;
    const dupla = s1 === s2 || s2 === s3 || s1 === s3;
    await sock.sendMessage(from, {
      text: `🎰 *CASSINO*\n\n┌─────────────┐\n│  ${s1}  │  ${s2}  │  ${s3}  │\n└─────────────┘\n\n${ganhou ? '🏆 *JACKPOT! VOCÊ GANHOU!* 🎉' : dupla ? '💫 *Quase! Dupla!*' : '❌ Não foi dessa vez, tente de novo!'}`,
    });
  },
};
