const fetch = require('node-fetch');

module.exports = {
  name: 'moeda',
  aliases: ['cotacao', 'dolar', 'dólar', 'euro', 'cambio', 'câmbio'],
  description: 'Cotação do dólar e euro em tempo real',
  async execute(sock, { from, args }) {
    try {
      const res = await fetch('https://economia.awesomeapi.com.br/json/last/USD-BRL,EUR-BRL,BTC-BRL');
      const d = await res.json();
      const usd = parseFloat(d.USDBRL.bid).toFixed(2);
      const eur = parseFloat(d.EURBRL.bid).toFixed(2);
      const btc = parseFloat(d.BTCBRL.bid).toLocaleString('pt-BR', { minimumFractionDigits: 2 });
      const hora = new Date().toLocaleTimeString('pt-BR');
      await sock.sendMessage(from, {
        text: `💱 *Cotações em tempo real*\n\n🇺🇸 Dólar (USD): R$ ${usd}\n🇪🇺 Euro (EUR): R$ ${eur}\n₿ Bitcoin: R$ ${btc}\n\n🕐 Atualizado às ${hora}`,
      });
    } catch {
      await sock.sendMessage(from, { text: '❌ Erro ao buscar cotações.' });
    }
  },
};
