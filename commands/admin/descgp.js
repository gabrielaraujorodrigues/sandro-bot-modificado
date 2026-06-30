module.exports = {
  name: 'descgp', aliases: ['descricaogp', 'setdesc'],
  adminOnly: true, groupOnly: true,
  description: 'Muda a descrição do grupo (ex: /descgp Nova descrição aqui)',
  async execute(sock, { from, args }) {
    const desc = args.join(' ');
    if (!desc) return sock.sendMessage(from, { text: '❌ Informe a nova descrição. Ex: /descgp Grupo de amigos' });
    try {
      await sock.groupUpdateDescription(from, desc);
      await sock.sendMessage(from, { text: `✅ Descrição do grupo atualizada!` });
    } catch {
      await sock.sendMessage(from, { text: '❌ Não consegui alterar a descrição. Preciso ser admin.' });
    }
  },
};
