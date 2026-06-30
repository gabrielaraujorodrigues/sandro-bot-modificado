module.exports = {
  name: 'menulogos', aliases: ['logos', 'logomenu', 'menulogo'],
  description: 'Menu de criação de logos e textos estilizados',
  async execute(sock, { from, prefix, settings, msg }) {
    const txt =
`╔♡∞*♡♡∞:｡.｡🩷｡.｡:∞♡*♡:∞♡╗
╠═⪩⟨🩷𝐌𝐄𝐍𝐔-𝐋𝐎𝐆𝐎𝐒⟩
╚♡∞*♡♡∞:｡.｡🩷｡.｡:∞♡*♡:∞♡╝
╭━━━⪩ *🎨 LOGOS COM TEXTO* ⪨━━━
│🩷⃤${prefix}logo neon (texto)
│🧚‍♀️⃤${prefix}logo fogo (texto)
│🩷⃤${prefix}logo gelo (texto)
│🧚‍♀️⃤${prefix}logo grafite (texto)
│🩷⃤${prefix}logo vintage (texto)
│🧚‍♀️⃤${prefix}logo sombra (texto)
│🩷⃤${prefix}logo espelho (texto)
│🧚‍♀️⃤${prefix}logo arcoiris (texto)
│🩷⃤${prefix}logo galaxy (texto)
│🧚‍♀️⃤${prefix}logo madeira (texto)
╰━━━━━─「愛」─━━━━━
╭━━━⪩ *📝 COMO USAR* ⪨━━━
│🩷⃤${prefix}logo neon SeuNome
│🧚‍♀️⃤${prefix}logo fogo Grupo dos Amigos
│🩷⃤${prefix}logo galaxy Sandro Bot
╰━━━━━─「愛」─━━━━━
🌸 _${settings.nomeDoBot} — use /menu para voltar_ 🌸`;
    await sock.sendMessage(from, { text: txt }, { quoted: msg });
  },
};
