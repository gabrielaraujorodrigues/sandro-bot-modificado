const fs = require('fs');
const path = require('path');
const SETTINGS = path.join(__dirname, '..', '..', 'settings.json');
module.exports = {
  name: 'configurar', aliases: ['setprefix', 'setnome'],
  ownerOnly: true,
  description: 'Configura o bot (ex: /configurar prefixo ! | /configurar nome MeuBot)',
  async execute(sock, { from, args }) {
    const s = JSON.parse(fs.readFileSync(SETTINGS));
    const campo = (args[0] || '').toLowerCase();
    const valor = args.slice(1).join(' ');
    if (!campo || !valor) {
      return sock.sendMessage(from, { text: `⚙️ *Configurações:*\n\n▸ /configurar prefixo <símbolo>\n▸ /configurar nome <nome>\n▸ /configurar boasvindas <mensagem>\n▸ /configurar saida <mensagem>\n▸ /configurar numero <número DDI>` });
    }
    const map = { prefixo: 'prefix', nome: 'nomeDoBot', boasvindas: 'mensagemBoasVindas', saida: 'mensagemSaida', numero: 'numeroDono' };
    if (!map[campo]) return sock.sendMessage(from, { text: '❌ Campo inválido. Use: prefixo, nome, boasvindas, saida, numero' });
    s[map[campo]] = campo === 'numero' ? valor.replace(/\D/g, '') : valor;
    fs.writeFileSync(SETTINGS, JSON.stringify(s, null, 2));
    await sock.sendMessage(from, { text: `✅ *${campo}* atualizado para: ${valor}` });
  },
};
