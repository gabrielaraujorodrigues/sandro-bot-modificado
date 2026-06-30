module.exports = {
  name: 'ppt', aliases: ['rps', 'pedrapapeltesoura'],
  description: 'Pedra, Papel ou Tesoura! (/ppt pedra|papel|tesoura)',
  async execute(sock, { from, args }) {
    const opcoes = ['pedra', 'papel', 'tesoura'];
    const emojis = { pedra: '🪨', papel: '📄', tesoura: '✂️' };
    const escolha = (args[0] || '').toLowerCase();
    if (!opcoes.includes(escolha)) {
      return sock.sendMessage(from, { text: '❌ Escolha: /ppt pedra | /ppt papel | /ppt tesoura' });
    }
    const bot = opcoes[Math.floor(Math.random() * 3)];
    let result;
    if (escolha === bot) result = '🟡 *Empate!*';
    else if ((escolha === 'pedra' && bot === 'tesoura') || (escolha === 'papel' && bot === 'pedra') || (escolha === 'tesoura' && bot === 'papel')) result = '🏆 *Você ganhou!*';
    else result = '💀 *Bot ganhou!*';
    await sock.sendMessage(from, { text: `✂️🪨📄 *Pedra, Papel, Tesoura!*\n\n👤 Você: ${emojis[escolha]} ${escolha}\n🤖 Bot: ${emojis[bot]} ${bot}\n\n${result}` });
  },
};
