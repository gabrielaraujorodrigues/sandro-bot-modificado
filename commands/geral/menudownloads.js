module.exports = {
  name: 'menudownloads', aliases: ['downloads', 'menumusica', 'download'],
  description: 'Menu de downloads e buscas de mídia',
  async execute(sock, { from, prefix, settings, msg }) {
    const txt =
`╔♡∞*♡♡∞:｡.｡🩷｡.｡:∞♡*♡:∞♡╗
╠═⪩⟨🩷𝐌𝐄𝐍𝐔-𝐃𝐎𝐖𝐍𝐋𝐎𝐀𝐃𝐒⟩
╚♡∞*♡♡∞:｡.｡🩷｡.｡:∞♡*♡:∞♡╝
╭━━━⪩ *🎵 MÚSICAS & VÍDEOS* ⪨━━━
│🩷⃤${prefix}play (nome da música)
│🧚‍♀️⃤${prefix}youtube (busca)
│🩷⃤${prefix}letra (música - artista)
╰━━━━━─「愛」─━━━━━
╭━━━⪩ *🎌 ANIMES* ⪨━━━
│🩷⃤${prefix}anime (nome) — Buscar anime
│🧚‍♀️⃤${prefix}waifu — Imagem de anime aleatória
╰━━━━━─「愛」─━━━━━
╭━━━⪩ *🎬 FILMES & SÉRIES* ⪨━━━
│🩷⃤${prefix}filme (nome) — Info do filme
╰━━━━━─「愛」─━━━━━
╭━━━⪩ *🐾 FOTOS DE ANIMAIS* ⪨━━━
│🩷⃤${prefix}gato — Foto de gatinho 🐱
│🧚‍♀️⃤${prefix}cachorro — Foto de cachorrinho 🐶
╰━━━━━─「愛」─━━━━━
╭━━━⪩ *⚡ POKÉMON* ⪨━━━
│🩷⃤${prefix}pokemon (nome) — Info completo
│🧚‍♀️⃤  Ex: ${prefix}pokemon pikachu
╰━━━━━─「愛」─━━━━━
╭━━━⪩ *😂 ENTRETENIMENTO* ⪨━━━
│🩷⃤${prefix}meme — Meme aleatório
│🧚‍♀️⃤${prefix}piada — Piada engraçada
╰━━━━━─「愛」─━━━━━
🌸 _${settings.nomeDoBot} — use /menu para voltar_ 🌸`;
    await sock.sendMessage(from, { text: txt }, { quoted: msg });
  },
};
