const fetch = require('node-fetch');

const ESTILOS = {
  neon: 4,
  fogo: 6,
  gelo: 8,
  grafite: 13,
  vintage: 7,
  sombra: 9,
  espelho: 11,
  arcoiris: 5,
  galaxy: 3,
  madeira: 2,
};

module.exports = {
  name: 'logo',
  aliases: ['texto', 'textart', ...Object.keys(ESTILOS).map(e => 'logo' + e)],
  description: 'Gera logo com texto estilizado (/logo <estilo> <texto> | estilos: neon, fogo, gelo, grafite, vintage)',
  async execute(sock, { from, args }) {
    if (args.length < 2) {
      const listaEstilos = Object.keys(ESTILOS).join(', ');
      return sock.sendMessage(from, { text: `🎨 *Gerador de Logo*\n\nUse: /logo <estilo> <texto>\n\nEstilos disponíveis:\n${listaEstilos}\n\nEx: /logo neon SeuNome` });
    }
    const estilo = args[0].toLowerCase();
    const textoLogo = args.slice(1).join(' ');
    const logoId = ESTILOS[estilo] || ESTILOS.neon;
    
    try {
      const url = `https://cooltext.com/PostChange?LogoID=${logoId}&Text=${encodeURIComponent(textoLogo)}&FontSize=70&Color1_color=FF0000&Integer1=15`;
      const res = await fetch(url, { timeout: 10000 });
      const data = await res.json();
      if (!data.renderLocation) throw new Error('sem imagem');
      
      const imgRes = await fetch(data.renderLocation);
      const buffer = Buffer.from(await imgRes.arrayBuffer());
      await sock.sendMessage(from, { image: buffer, caption: `🎨 Logo: *${textoLogo}* (estilo: ${estilo})` });
    } catch {
      await sock.sendMessage(from, { text: `❌ Erro ao gerar logo. Tente: /logo neon SeuTexto` });
    }
  },
};
