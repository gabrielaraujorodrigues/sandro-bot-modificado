module.exports = {
  name: 'instastalk', aliases: ['igstalk', 'instagram'],
  description: 'Abre perfil do Instagram (/instastalk usuario)',
  async execute(sock, { from, args }) {
    const user = (args[0] || '').replace('@', '');
    if (!user) return sock.sendMessage(from, { text: '❌ Use: /instastalk usuario' });
    await sock.sendMessage(from, {
      text: `📸 *Instagram: @${user}*\n\n🔗 https://instagram.com/${user}\n\n_Abra o link para ver o perfil completo._`,
    });
  },
};
