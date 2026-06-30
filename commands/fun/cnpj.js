const fetch = require('node-fetch');
module.exports = {
  name: 'cnpj', aliases: ['empresa'],
  description: 'Dados de empresa pelo CNPJ (/cnpj 00000000000191)',
  async execute(sock, { from, args }) {
    const cnpj = (args[0] || '').replace(/\D/g, '');
    if (cnpj.length !== 14) return sock.sendMessage(from, { text: '❌ CNPJ deve ter 14 dígitos. Ex: /cnpj 00000000000191' });
    try {
      const res = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cnpj}`);
      if (!res.ok) throw new Error();
      const d = await res.json();
      await sock.sendMessage(from, {
        text: `🏢 *Dados do CNPJ*\n\n📋 CNPJ: ${d.cnpj}\n🏢 Razão Social: ${d.razao_social}\n📌 Fantasia: ${d.nome_fantasia || '-'}\n📍 ${d.logradouro}, ${d.numero} — ${d.municipio}/${d.uf}\n📧 ${d.email || '-'}\n📱 ${d.ddd_telefone_1 || '-'}\n📅 Fundação: ${d.data_inicio_atividade}\n✅ Situação: ${d.descricao_situacao_cadastral}`,
      });
    } catch { await sock.sendMessage(from, { text: `❌ CNPJ não encontrado ou inválido.` }); }
  },
};
