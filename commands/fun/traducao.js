const fetch = require('node-fetch');

module.exports = {
  name: 'traduzir',
  aliases: ['traduz', 'translate', 'tr'],
  description: 'Traduz texto (ex: /traduzir en Hello World | /traduzir pt Hello)',
  async execute(sock, { from, args }) {
    if (args.length < 2) return sock.sendMessage(from, { text: '❌ Use: /traduzir <idioma> <texto>\nEx: /traduzir en Olá mundo\nIdiomas: pt, en, es, fr, de, it, ja, ko, zh' });
    const idioma = args[0].toLowerCase();
    const texto = args.slice(1).join(' ');
    try {
      // Usa a API gratuita do MyMemory
      const res = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(texto)}&langpair=auto|${idioma}`);
      const data = await res.json();
      const traducao = data.responseData?.translatedText;
      if (!traducao) throw new Error('sem tradução');
      const nomes = { pt: '🇧🇷 Português', en: '🇺🇸 Inglês', es: '🇪🇸 Espanhol', fr: '🇫🇷 Francês', de: '🇩🇪 Alemão', it: '🇮🇹 Italiano', ja: '🇯🇵 Japonês', ko: '🇰🇷 Coreano', zh: '🇨🇳 Chinês' };
      await sock.sendMessage(from, {
        text: `🌐 *Tradução para ${nomes[idioma] || idioma}:*\n\n📝 Original: ${texto}\n🔄 Tradução: ${traducao}`,
      });
    } catch {
      await sock.sendMessage(from, { text: '❌ Erro ao traduzir. Verifique o idioma e tente novamente.' });
    }
  },
};
