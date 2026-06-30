module.exports = {
  name: 'menufig', aliases: ['menufigurinha', 'figurinhas', 'efeitosimg', 'stickers'],
  description: 'Menu de figurinhas e efeitos de imagem',
  async execute(sock, { from, prefix, settings, msg }) {
    const txt =
`╔♡∞*♡♡∞:｡.｡🩷｡.｡:∞♡*♡:∞♡╗
╠═⪩⟨🩷𝐌𝐄𝐍𝐔-𝐅𝐈𝐆𝐔𝐑𝐈𝐍𝐇𝐀𝐒⟩
╚♡∞*♡♡∞:｡.｡🩷｡.｡:∞♡*♡:∞♡╝
╭━━━⪩ *🎭 FIGURINHAS* ⪨━━━
│🩷⃤${prefix}sticker — Imagem → Figurinha
│🧚‍♀️⃤  (envie imagem ou vídeo com /sticker)
│🩷⃤${prefix}toimg — Figurinha → Imagem
│🧚‍♀️⃤  (responda uma figurinha com /toimg)
╰━━━━━─「愛」─━━━━━
╭━━━⪩ *🎨 LOGOS & EFEITOS* ⪨━━━
│🩷⃤${prefix}logo (estilo) (texto)
│🧚‍♀️⃤  Estilos disponíveis:
│🩷⃤  neon, fogo, gelo, grafite
│🧚‍♀️⃤  vintage, sombra, espelho
│🩷⃤  arcoiris, galaxy, madeira
│🧚‍♀️⃤  Ex: ${prefix}logo neon SeuNome
╰━━━━━─「愛」─━━━━━
╭━━━⪩ *🖼️ IMAGENS* ⪨━━━
│🩷⃤${prefix}waifu — Anime girl aleatória
│🧚‍♀️⃤${prefix}gato — Foto de gato 🐱
│🩷⃤${prefix}cachorro — Foto de cachorro 🐶
│🧚‍♀️⃤${prefix}meme — Meme aleatório 😂
╰━━━━━─「愛」─━━━━━
🌸 _${settings.nomeDoBot} — use /menu para voltar_ 🌸`;
    await sock.sendMessage(from, { text: txt }, { quoted: msg });
  },
};
