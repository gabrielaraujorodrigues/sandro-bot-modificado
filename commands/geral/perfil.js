module.exports = {
  name: 'perfil', aliases: ['profile', 'meuperfil', 'eu'],
  description: 'Mostra seu perfil no bot',
  async execute(sock, { from, sender, isGroup, msg }) {
    let nome = msg?.pushName || sender.split('@')[0];
    const numero = sender.split('@')[0].replace('@s.whatsapp.net', '');
    let isAdmin = false;
    if (isGroup) {
      try {
        const meta = await sock.groupMetadata(from);
        const p = meta.participants.find(x => x.id === sender);
        isAdmin = !!(p && (p.admin === 'admin' || p.admin === 'superadmin'));
      } catch {}
    }
    
    let foto = null;
    try {
      const ppUrl = await sock.profilePictureUrl(sender, 'image');
      if (ppUrl) {
        const fetch = require('node-fetch');
        const res = await fetch(ppUrl);
        foto = Buffer.from(await res.arrayBuffer());
      }
    } catch {}
    
    const txt = `👤 *Seu Perfil*\n\n🩷 Nome: ${nome}\n🧚‍♀️ Número: +${numero}\n🩷 Admin: ${isAdmin ? 'Sim 🛡️' : 'Não'}\n🧚‍♀️ Tipo: ${isGroup ? 'Grupo' : 'Privado'}`;
    
    if (foto) {
      await sock.sendMessage(from, { image: foto, caption: txt });
    } else {
      await sock.sendMessage(from, { text: txt });
    }
  },
};
