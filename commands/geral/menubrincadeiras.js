module.exports = {
  name: 'menubrincadeiras', aliases: ['brincadeiras', 'menujogos', 'jogos'],
  description: 'Menu de brincadeiras e jogos',
  async execute(sock, { from, prefix, settings, msg }) {
    const txt =
`╔♡∞*♡♡∞:｡.｡🩷｡.｡:∞♡*♡:∞♡╗
╠═⪩⟨🩷𝐌𝐄𝐍𝐔-𝐉𝐎𝐆𝐎𝐒⟩
╚♡∞*♡♡∞:｡.｡🩷｡.｡:∞♡*♡:∞♡╝
╭━━━⪩ *🎮 JOGOS* ⪨━━━
│🩷⃤${prefix}cassino — Caça-níqueis 🎰
│🧚‍♀️⃤${prefix}ppt — Pedra Papel Tesoura ✂️
│🩷⃤${prefix}dado — Rolar um dado 🎲
│🧚‍♀️⃤${prefix}bola8 — Bola mágica 🎱
│🩷⃤${prefix}adivinha — Adivinhar número (1-100)
│🧚‍♀️⃤${prefix}vab — Você prefere? 🤔
│🩷⃤${prefix}eununca — Eu nunca, eu já 👆
│🧚‍♀️⃤${prefix}aleatorio — Sorteio aleatório 🎯
╰━━━━━─「愛」─━━━━━
╭━━━⪩ *💕 BRINCADEIRAS (mencione @)* ⪨━━━
│🩷⃤${prefix}ship (@@) — Casal de membros
│🧚‍♀️⃤${prefix}casal — Casal do grupo
│🩷⃤${prefix}chance (algo) — Chance de acontecer
│🧚‍♀️⃤${prefix}morte (nome) — Previsão de morte 💀
│🩷⃤${prefix}gay (@) — % de gay 🌈
│🧚‍♀️⃤${prefix}feio (@) — % de feiúra 😬
│🩷⃤${prefix}gostosa (@) — % de gostosura 🔥
│🧚‍♀️⃤${prefix}beijo (@) — Mandar beijo 😘
│🩷⃤${prefix}matar (@) — Matar (brincadeira) 💀
│🧚‍♀️⃤${prefix}tapa (@) — Dar um tapa 👋
│🩷⃤${prefix}gerarsenha — Gerar senha segura 🔐
╰━━━━━─「愛」─━━━━━
╭━━━⪩ *🏆 RANKINGS DO GRUPO* ⪨━━━
│🩷⃤${prefix}rankgay — Top 5 gays 🌈
│🧚‍♀️⃤${prefix}rankcorno — Top 5 cornos 🦌
│🩷⃤${prefix}rankzueiro — Top 5 zueiros 😂
│🧚‍♀️⃤${prefix}rankgostoso — Top 5 gostosos 🔥
│🩷⃤${prefix}rankgostosa — Top 5 gostosas 💅
│🧚‍♀️⃤${prefix}rankgado — Top 5 gados 🐄
│🩷⃤${prefix}rankotaku — Top 5 otakus 🎌
│🧚‍♀️⃤${prefix}ranklixo — Top 5 lixos 🗑️
╰━━━━━─「愛」─━━━━━
🌸 _${settings.nomeDoBot} — use /menu para voltar_ 🌸`;
    await sock.sendMessage(from, { text: txt }, { quoted: msg });
  },
};
