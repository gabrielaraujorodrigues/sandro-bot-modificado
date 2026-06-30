const fetch = require('node-fetch');
module.exports = {
  name: 'feriados', aliases: ['holiday', 'diafolga'],
  description: 'Próximos feriados nacionais do Brasil',
  async execute(sock, { from }) {
    try {
      const ano = new Date().getFullYear();
      const res = await fetch(`https://brasilapi.com.br/api/feriados/v1/${ano}`);
      const feriados = await res.json();
      const hoje = new Date();
      const proximos = feriados.filter(f => new Date(f.date + 'T12:00:00') >= hoje).slice(0, 8);
      if (!proximos.length) return sock.sendMessage(from, { text: '❌ Nenhum feriado encontrado.' });
      let txt = `🎉 *Próximos Feriados Nacionais ${ano}*\n\n`;
      proximos.forEach(f => {
        const d = new Date(f.date + 'T12:00:00');
        txt += `📅 ${d.toLocaleDateString('pt-BR')} — ${f.name}\n`;
      });
      await sock.sendMessage(from, { text: txt });
    } catch { await sock.sendMessage(from, { text: '❌ Erro ao buscar feriados.' }); }
  },
};
