module.exports = {
  name: 'roletarussa', aliases: ['roulette'],
  adminOnly: true, groupOnly: true,
  description: 'Roleta russa — 1/6 de chance de ser removido do grupo',
  async execute(sock, { from, sender }) {
    const sorte = Math.floor(Math.random() * 6) + 1;
    if (sorte === 1) {
      try {
        await sock.sendMessage(from, { text: `🔫 *BANG!* @${sender.split('@')[0]} perdeu na roleta russa e foi removido do grupo! 💀`, mentions: [sender] });
        await sock.groupParticipantsUpdate(from, [sender], 'remove');
      } catch {
        await sock.sendMessage(from, { text: `🔫 *BANG!* @${sender.split('@')[0]} perdeu na roleta russa! (Não consegui remover — preciso ser admin)`, mentions: [sender] });
      }
    } else {
      await sock.sendMessage(from, { text: `🔫 *Click!* @${sender.split('@')[0]} sobreviveu! (${7 - sorte}/6 câmaras restantes) 😅`, mentions: [sender] });
    }
  },
};
