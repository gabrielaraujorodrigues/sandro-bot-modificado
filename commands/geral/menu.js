const fs = require('fs');
const path = require('path');

module.exports = {
  name: 'menu',
  aliases: ['help', 'ajuda', 'comandos', 'cmd', 'inicio', 'start'],
  description: 'Mostra o menu principal com todos os submenus',
  async execute(sock, { from, prefix, settings, msg, sender }) {
    const pushname = msg?.pushName || sender.split('@')[0];

    const txt =
`╔♡∞*♡♡∞:｡.｡🩷｡.｡:∞♡*♡:∞♡╗
╠═⪩⟨🧚‍♀️𝐒𝐄𝐉𝐀-𝐁𝐄𝐌-𝐕𝐈𝐍𝐃𝐎(𝐀)⟩
╚♡∞*♡♡∞:｡.｡🩷｡.｡:∞♡*♡:∞♡╝
╭━━⪩ 愛 INFO BOT | USER 愛 ⪨━━
│🧚‍♀️⃤Bot: ${settings.nomeDoBot}
│🩷⃤Dono: ${settings.nickDono}
│🧚‍♀️⃤Usuário: *${pushname}*
│🩷⃤Biblioteca: Baileys
│🧚‍♀️⃤Prefixo: [${prefix}]
│🩷⃤Versão: 2.0
╰━━━━━─「愛」─━━━━━
╭━━━⪩ *📂 SUBMENUS* ⪨━━━
│🩷⃤${prefix}menutextos
│🧚‍♀️⃤${prefix}menubrincadeiras
│🩷⃤${prefix}menudownloads
│🧚‍♀️⃤${prefix}menufig
│🩷⃤${prefix}menulogos
│🧚‍♀️⃤${prefix}menuia
│🩷⃤${prefix}menulink
│🧚‍♀️⃤${prefix}menuutil
│🩷⃤${prefix}menurpg
│🧚‍♀️⃤${prefix}menuadm
│🩷⃤${prefix}menupremium
│🧚‍♀️⃤${prefix}menudono
│🩷⃤${prefix}infodono
╰━━━━━─「愛」─━━━━━
╭━━━⪩ *⚡ COMANDOS RÁPIDOS* ⪨━━━
│🩷⃤${prefix}ping — Testar o bot
│🧚‍♀️⃤${prefix}play (música) — Baixar música
│🩷⃤${prefix}ia (texto) — Falar com IA
│🧚‍♀️⃤${prefix}sticker — Criar figurinha
│🩷⃤${prefix}clima (cidade) — Previsão
│🧚‍♀️⃤${prefix}traduzir (idioma) (texto)
│🩷⃤${prefix}piada — Piada aleatória
│🧚‍♀️⃤${prefix}cantada — Cantada do dia
│🩷⃤${prefix}cassino — Jogo 🎰
│🧚‍♀️⃤${prefix}casal — Casal do grupo
╰━━━━━─「愛」─━━━━━
🌸 _${settings.nomeDoBot} v2 — use os submenus acima!_ 🌸`;

    const fotoPath = path.join(__dirname, '..', '..', 'assets', 'menu.jpg');
    if (fs.existsSync(fotoPath)) {
      const foto = fs.readFileSync(fotoPath);
      await sock.sendMessage(from, { image: foto, caption: txt }, { quoted: msg });
    } else {
      await sock.sendMessage(from, { text: txt }, { quoted: msg });
    }
  },
};
