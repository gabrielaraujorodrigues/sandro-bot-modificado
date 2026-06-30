module.exports = {
  name: 'menutextos', aliases: ['textos', 'menubasico', 'menuff', 'menufrases'],
  description: 'Menu de textos, frases e cantadas',
  async execute(sock, { from, prefix, settings, msg }) {
    const txt =
`╔♡∞*♡♡∞:｡.｡🩷｡.｡:∞♡*♡:∞♡╗
╠═⪩⟨🩷𝐌𝐄𝐍𝐔-𝐓𝐄𝐗𝐓𝐎𝐒⟩
╚♡∞*♡♡∞:｡.｡🩷｡.｡:∞♡*♡:∞♡╝
╭━━━⪩ *💬 CMD DE TEXTO* ⪨━━━
│🩷⃤${prefix}piada — Piada aleatória 😂
│🧚‍♀️⃤${prefix}cantada — Cantada do dia 😍
│🩷⃤${prefix}indireta — Indireta pesada 🙄
│🧚‍♀️⃤${prefix}motivacional — Frase motivacional 💪
│🩷⃤${prefix}fraseamor — Frase de amor 💖
│🧚‍♀️⃤${prefix}deboche — Deboche do dia 😏
│🩷⃤${prefix}ansiedade — Frase de ansiedade 😰
│🧚‍♀️⃤${prefix}raiva — Frase de raiva 😡
╰━━━━━─「愛」─━━━━━
╭━━━⪩ *🎯 DIVERSÃO* ⪨━━━
│🩷⃤${prefix}ia (mensagem) — Falar com IA 🤖
│🧚‍♀️⃤${prefix}traduzir (idioma) (texto)
│🩷⃤${prefix}instastalk (usuario) — Instagram
╰━━━━━─「愛」─━━━━━
🌸 _${settings.nomeDoBot} — use /menu para voltar_ 🌸`;
    await sock.sendMessage(from, { text: txt }, { quoted: msg });
  },
};
