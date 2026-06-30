module.exports = {
  name: 'grupoinfo', aliases: ['infogrupo', 'gpinfo'],
  groupOnly: true,
  description: 'Mostra informações do grupo',
  async execute(sock, { from }) {
    try {
      const meta = await sock.groupMetadata(from);
      const admins = meta.participants.filter(p => p.admin).length;
      const total = meta.participants.length;
      const criado = new Date(meta.creation * 1000).toLocaleDateString('pt-BR');
      await sock.sendMessage(from, {
        text: `📊 *Informações do Grupo*\n\n` +
              `📌 Nome: ${meta.subject}\n` +
              `👥 Membros: ${total}\n` +
              `🛡️ Admins: ${admins}\n` +
              `📅 Criado em: ${criado}\n` +
              `🆔 ID: ${from}\n` +
              (meta.desc ? `📝 Descrição: ${meta.desc}` : ''),
      });
    } catch (e) {
      await sock.sendMessage(from, { text: '❌ Erro ao buscar informações: ' + e.message });
    }
  },
};
