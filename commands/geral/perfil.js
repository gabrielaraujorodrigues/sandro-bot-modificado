module.exports = {
  name: 'perfil',
  aliases: ['profile', 'eu', 'quem'],
  description: 'Mostra informações do perfil de um usuário',
  async execute(sock, { from, sender, msg, isGroup }) {
    const ctx = msg.message?.extendedTextMessage?.contextInfo;
    const alvo = ctx?.mentionedJid?.[0] || ctx?.participant || sender;
    const numero = alvo.split('@')[0];
    try {
      const foto = await sock.profilePictureUrl(alvo, 'image').catch(() => null);
      let txt = `👤 *Perfil*\n\n📱 Número: +${numero}`;
      if (isGroup) {
        const meta = await sock.groupMetadata(from);
        const p = meta.participants.find(x => x.id === alvo);
        if (p) txt += `\n🛡️ Cargo: ${p.admin === 'superadmin' ? 'Dono do grupo' : p.admin === 'admin' ? 'Administrador' : 'Membro'}`;
      }
      if (foto) {
        const res = await require('node-fetch')(foto);
        const buffer = Buffer.from(await res.arrayBuffer());
        await sock.sendMessage(from, { image: buffer, caption: txt });
      } else {
        await sock.sendMessage(from, { text: txt });
      }
    } catch (e) {
      await sock.sendMessage(from, { text: `❌ Erro ao buscar perfil: ${e.message}` });
    }
  },
};
