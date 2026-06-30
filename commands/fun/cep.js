const fetch = require('node-fetch');

module.exports = {
  name: 'cep',
  aliases: ['endereco', 'endereço'],
  description: 'Busca informações de um CEP (ex: /cep 01310100)',
  async execute(sock, { from, args }) {
    const cep = (args[0] || '').replace(/\D/g, '');
    if (cep.length !== 8) return sock.sendMessage(from, { text: '❌ Informe um CEP válido com 8 dígitos. Ex: /cep 01310100' });
    try {
      const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const d = await res.json();
      if (d.erro) return sock.sendMessage(from, { text: '❌ CEP não encontrado.' });
      await sock.sendMessage(from, {
        text: `📮 *CEP ${cep}*\n\n🏠 Logradouro: ${d.logradouro || '—'}\n🏘️ Bairro: ${d.bairro || '—'}\n🏙️ Cidade: ${d.localidade}\n🗺️ Estado: ${d.uf}\n`,
      });
    } catch {
      await sock.sendMessage(from, { text: '❌ Erro ao buscar CEP.' });
    }
  },
};
