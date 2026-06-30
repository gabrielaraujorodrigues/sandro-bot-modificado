module.exports = {
  name: 'validarcpf', aliases: ['cpfvalido'],
  description: 'Valida se um CPF é matematicamente válido (/validarcpf 12345678909)',
  async execute(sock, { from, args }) {
    const cpf = (args[0] || '').replace(/\D/g, '');
    if (cpf.length !== 11) return sock.sendMessage(from, { text: '❌ CPF deve ter 11 dígitos. Ex: /validarcpf 12345678909' });
    if (/^(\d)\1+$/.test(cpf)) return sock.sendMessage(from, { text: `❌ CPF *${cpf}* é inválido (dígitos repetidos).` });
    let sum = 0;
    for (let i = 0; i < 9; i++) sum += parseInt(cpf[i]) * (10 - i);
    let d1 = 11 - (sum % 11); if (d1 >= 10) d1 = 0;
    sum = 0;
    for (let i = 0; i < 10; i++) sum += parseInt(cpf[i]) * (11 - i);
    let d2 = 11 - (sum % 11); if (d2 >= 10) d2 = 0;
    const valido = d1 === parseInt(cpf[9]) && d2 === parseInt(cpf[10]);
    const fmt = cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    await sock.sendMessage(from, { text: `🔍 *Validação de CPF*\n\n📋 CPF: ${fmt}\n${valido ? '✅ *VÁLIDO* matematicamente' : '❌ *INVÁLIDO*'}\n\n_Obs: matematicamente válido não significa que está ativo._` });
  },
};
