const fs = require('fs');
const path = require('path');

const SETTINGS_PATH = path.join(__dirname, '..', '..', 'settings.json');

module.exports = {
  name: 'configurar',
  aliases: ['setowner', 'setprefix'],
  ownerOnly: true,
  description: 'Configura prefixo ou nome do bot (ex: /configurar prefixo !)',
  async execute(sock, ctx) {
    const { from, args } = ctx;
    const settings = JSON.parse(fs.readFileSync(SETTINGS_PATH));
    const campo = (args[0] || '').toLowerCase();
    const valor = args.slice(1).join(' ');

    if (!campo || !valor) {
      await sock.sendMessage(from, {
        text:
          '⚙️ *Configurações disponíveis:*\n\n' +
          '▸ /configurar prefixo <símbolo>\n' +
          '▸ /configurar nome <nome do bot>\n' +
          '▸ /configurar boasvindas <mensagem>',
      });
      return;
    }

    if (campo === 'prefixo') settings.prefix = valor;
    else if (campo === 'nome') settings.nomeDoBot = valor;
    else if (campo === 'boasvindas') settings.mensagemBoasVindas = valor;
    else {
      await sock.sendMessage(from, { text: '❌ Campo inválido.' });
      return;
    }

    fs.writeFileSync(SETTINGS_PATH, JSON.stringify(settings, null, 2));
    await sock.sendMessage(from, { text: `✅ Configuração *${campo}* atualizada com sucesso!` });
  },
};
