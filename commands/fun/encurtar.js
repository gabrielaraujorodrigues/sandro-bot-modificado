const fetch = require('node-fetch');

module.exports = {
  name: 'encurtar',
  aliases: ['url', 'shorturl', 'link'],
  description: 'Encurta uma URL (ex: /encurtar https://google.com)',
  async execute(sock, { from, args }) {
    const url = args[0];
    if (!url || !url.startsWith('http')) return sock.sendMessage(from, { text: '❌ Informe uma URL válida. Ex: /encurtar https://google.com' });
    try {
      const res = await fetch(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(url)}`);
      const short = await res.text();
      await sock.sendMessage(from, { text: `🔗 *URL encurtada:*\n\n${short}` });
    } catch {
      await sock.sendMessage(from, { text: '❌ Erro ao encurtar a URL.' });
    }
  },
};
