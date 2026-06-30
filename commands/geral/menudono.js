module.exports = {
  name: 'menudono', aliases: ['menuowner', 'dono'],
  description: 'Menu de comandos exclusivos do dono',
  async execute(sock, { from, prefix, settings, msg, sender }) {
    const isOwner = sender.split('@')[0].replace(/\D/g, '') === String(settings.numeroDono);
    if (!isOwner) {
      return sock.sendMessage(from, { text: '🔒 Este menu é exclusivo do *dono do bot*.' });
    }
    const txt =
`╔♡∞*♡♡∞:｡.｡🩷｡.｡:∞♡*♡:∞♡╗
╠═⪩⟨🩷𝐌𝐄𝐍𝐔 𝐃𝐎𝐍𝐎⟩
╚♡∞*♡♡∞:｡.｡🩷｡.｡:∞♡*♡:∞♡╝
╭━━━⪩ *👑 CONFIGURAÇÕES* ⪨━━━
│🩷⃤${prefix}configurar — Configurar o bot
│🧚‍♀️⃤${prefix}sairgp — Bot sai do grupo
╰━━━━━─「愛」─━━━━━
╭━━━⪩ *📋 PARA USAR* ⪨━━━
│🩷⃤Para ver admins: ${prefix}menuadm
│🧚‍♀️⃤Para configurar: edite settings.json
│🩷⃤Para reiniciar: Ctrl+C e node index.js
╰━━━━━─「愛」─━━━━━
🌸 _Acesso restrito — dono: ${settings.nickDono}_ 🌸`;
    await sock.sendMessage(from, { text: txt }, { quoted: msg });
  },
};
