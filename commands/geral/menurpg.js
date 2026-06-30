module.exports = {
  name: 'menurpg', aliases: ['rpg', 'city', 'menucity'],
  description: 'Menu de jogos e apostas RPG City',
  async execute(sock, { from, prefix, settings, msg }) {
    const txt =
`╔♡∞*♡♡∞:｡.｡🩷｡.｡:∞♡*♡:∞♡╗
╠═⪩⟨🩷𝐂𝐈𝐓𝐘 𝐑𝐏𝐆⟩
╚♡∞*♡♡∞:｡.｡🩷｡.｡:∞♡*♡:∞♡╝
╭━━━⪩ *🎰 APOSTAS* ⪨━━━
│🩷⃤${prefix}cassino — Caça-níqueis 🎰
│🧚‍♀️⃤${prefix}dado — Rolar dado 🎲
│🩷⃤${prefix}bola8 — Bola mágica 🎱
│🧚‍♀️⃤${prefix}ppt — Pedra Papel Tesoura
│🩷⃤${prefix}adivinha — Adivinhar número
╰━━━━━─「愛」─━━━━━
╭━━━⪩ *🎮 ENTRETENIMENTO* ⪨━━━
│🩷⃤${prefix}vab — Você prefere? 🤔
│🧚‍♀️⃤${prefix}eununca — Eu nunca, eu já
│🩷⃤${prefix}roletarussa — Roleta russa 🔫
│🧚‍♀️⃤${prefix}chance (algo) — Calcular chance
│🩷⃤${prefix}morte — Previsão de morte 💀
╰━━━━━─「愛」─━━━━━
╭━━━⪩ *🏆 RANKINGS* ⪨━━━
│🩷⃤${prefix}rankgay / rankcorno
│🧚‍♀️⃤${prefix}rankzueiro / rankgado
│🩷⃤${prefix}rankotaku / ranklixo
│🧚‍♀️⃤${prefix}casal — Casal do grupo
│🩷⃤${prefix}ship (@@ ) — Compatibilidade
╰━━━━━─「愛」─━━━━━
🌸 _${settings.nomeDoBot} — use /menu para voltar_ 🌸`;
    await sock.sendMessage(from, { text: txt }, { quoted: msg });
  },
};
