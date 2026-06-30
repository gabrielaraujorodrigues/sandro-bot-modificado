const fetch = require('node-fetch');

module.exports = {
  name: 'clima',
  aliases: ['tempo', 'weather', 'previsao', 'previsão'],
  description: 'Mostra o clima de uma cidade (ex: /clima São Paulo)',
  async execute(sock, { from, args }) {
    const cidade = args.join(' ') || 'Brasil';
    try {
      const res = await fetch(`https://wttr.in/${encodeURIComponent(cidade)}?format=j1&lang=pt`, {
        headers: { 'User-Agent': 'curl/7.0' },
      });
      const data = await res.json();
      const atual = data.current_condition[0];
      const local = data.nearest_area[0];
      const nomeCidade = local.areaName[0].value + ', ' + local.country[0].value;
      const temp = atual.temp_C;
      const sensacao = atual.FeelsLikeC;
      const umidade = atual.humidity;
      const vento = atual.windspeedKmph;
      const descricao = atual.lang_pt?.[0]?.value || atual.weatherDesc[0].value;
      const previsao = data.weather.slice(0, 3).map(d => {
        const max = d.maxtempC, min = d.mintempC;
        const desc = d.hourly[4]?.lang_pt?.[0]?.value || d.hourly[4]?.weatherDesc?.[0]?.value || '';
        const data_str = `${d.date.split('-')[2]}/${d.date.split('-')[1]}`;
        return `📅 ${data_str} — ${min}°C↓ ${max}°C↑ | ${desc}`;
      });
      await sock.sendMessage(from, {
        text: `🌤️ *Clima em ${nomeCidade}*\n\n` +
              `🌡️ Temperatura: *${temp}°C*\n` +
              `🤔 Sensação: ${sensacao}°C\n` +
              `💧 Umidade: ${umidade}%\n` +
              `💨 Vento: ${vento} km/h\n` +
              `📍 Condição: ${descricao}\n\n` +
              `*📆 Próximos dias:*\n${previsao.join('\n')}`,
      });
    } catch (e) {
      await sock.sendMessage(from, { text: '❌ Erro ao buscar clima. Verifique o nome da cidade.' });
    }
  },
};
