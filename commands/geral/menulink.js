module.exports = {
  name: 'menulink', aliases: ['links', 'menufilmes', 'menuseries', 'menuapps'],
  description: 'Menu de links de filmes, séries e apps',
  async execute(sock, { from, prefix, settings, msg }) {
    const txt =
`╔♡∞*♡♡∞:｡.｡🩷｡.｡:∞♡*♡:∞♡╗
╠═⪩⟨🩷𝐌𝐄𝐍𝐔-𝐋𝐈𝐍𝐊𝐒⟩
╚♡∞*♡♡∞:｡.｡🩷｡.｡:∞♡*♡:∞♡╝
╭━━━⪩ *🎬 BUSCAR FILME/SÉRIE* ⪨━━━
│🩷⃤${prefix}filme (nome) — Info + pôster
│🧚‍♀️⃤${prefix}anime (nome) — Info de anime
│🩷⃤Ex: ${prefix}filme Moana
│🧚‍♀️⃤Ex: ${prefix}anime Naruto
╰━━━━━─「愛」─━━━━━
╭━━━⪩ *🔗 SITES ÚTEIS* ⪨━━━
│🩷⃤📺 Filmes grátis: cuevana.io
│🧚‍♀️⃤📺 Séries: filmeserie.com
│🩷⃤🎮 Jogos PC: igg-games.com
│🧚‍♀️⃤📱 Apps APK: apkpure.com
│🩷⃤🎵 Músicas: play.google.com
│🧚‍♀️⃤📚 Livros: z-lib.org
╰━━━━━─「愛」─━━━━━
╭━━━⪩ *🔧 UTILITÁRIOS* ⪨━━━
│🩷⃤${prefix}encurtar (link) — Encurtar URL
│🧚‍♀️⃤${prefix}youtube (busca) — Buscar no YT
│🩷⃤${prefix}play (música) — Baixar música
╰━━━━━─「愛」─━━━━━
🌸 _${settings.nomeDoBot} — use /menu para voltar_ 🌸`;
    await sock.sendMessage(from, { text: txt }, { quoted: msg });
  },
};
