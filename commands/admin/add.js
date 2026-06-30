module.exports = {
  name: 'add', aliases: ['adicionar'],
  adminOnly: true, groupOnly: true,
  description: 'Adiciona um número ao grupo (ex: /add 5511999999999)',
  async execute(sock, { from, args }) {
    const numero = (args[0] || '').replace(/\D/g, '');
    if (!numero) return sock.sendMessage(from, { text: '❌ Informe o número com DDI. Ex: /add 5511999999999' });
    const jid = `${numero}@s.whatsapp.net`;
    try {
      await sock.groupParticipantsUpdate(from, [jid], 'add');
      await sock.sendMessage(from, { text: `✅ @${numero} adicionado!`, mentions: [jid] });
    } catch {
      await sock.sendMessage(from, { text: '❌ Não foi possível adicionar. O número pode ter restrição de privacidade.' });
    }
  },
};
