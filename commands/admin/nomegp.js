module.exports = {
  name: 'nomegp', aliases: ['renomear', 'setnome'],
  adminOnly: true, groupOnly: true,
  description: 'Muda o nome do grupo (ex: /nomegp Meu Grupo Novo)',
  async execute(sock, { from, args }) {
    const nome = args.join(' ');
    if (!nome) return sock.sendMessage(from, { text: '❌ Informe o novo nome. Ex: /nomegp Meu Grupo' });
    try {
      await sock.groupUpdateSubject(from, nome);
      await sock.sendMessage(from, { text: `✅ Nome do grupo alterado para: *${nome}*` });
    } catch {
      await sock.sendMessage(from, { text: '❌ Não consegui alterar o nome. Preciso ser admin.' });
    }
  },
};
