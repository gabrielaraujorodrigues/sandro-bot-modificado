module.exports = {
  name: 'add',
  aliases: ['adicionar'],
  adminOnly: true,
  groupOnly: true,
  description: 'Adiciona um número ao grupo (ex: /add 5586999999999)',
  async execute(sock, ctx) {
    const { from, args } = ctx;
    const numero = (args[0] || '').replace(/[^0-9]/g, '');

    if (!numero) {
      await sock.sendMessage(from, { text: '❌ Informe o número com DDI. Ex: /add 5586999999999' });
      return;
    }

    const jid = `${numero}@s.whatsapp.net`;
    try {
      await sock.groupParticipantsUpdate(from, [jid], 'add');
      await sock.sendMessage(from, { text: `✅ Convite enviado para @${numero}!`, mentions: [jid] });
    } catch (e) {
      await sock.sendMessage(from, { text: '❌ Não foi possível adicionar. O número pode ter restrição de privacidade.' });
    }
  },
};
