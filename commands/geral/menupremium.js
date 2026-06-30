module.exports = {
  name: 'menupremium', aliases: ['premium', 'vip', 'menuvip'],
  description: 'Menu de recursos premium/VIP',
  async execute(sock, { from, prefix, settings, msg }) {
    const txt =
`╔♡∞*♡♡∞:｡.｡🩷｡.｡:∞♡*♡:∞♡╗
╠═⪩⟨🩷𝐌𝐄𝐍𝐔-𝐏𝐑𝐄𝐌𝐈𝐔𝐌⟩
╚♡∞*♡♡∞:｡.｡🩷｡.｡:∞♡*♡:∞♡╝
╭━━━⪩ *💎 RECURSOS VIP* ⪨━━━
│🩷⃤${prefix}play — Download ilimitado YT
│🧚‍♀️⃤${prefix}encurtar — Encurtar links
│🩷⃤${prefix}letra — Letras de músicas
│🧚‍♀️⃤${prefix}ia — IA sem limite
│🩷⃤${prefix}traduzir — Tradução ilimitada
│🧚‍♀️⃤${prefix}moeda — Cotação em tempo real
│🩷⃤${prefix}cep — Busca de CEP
│🧚‍♀️⃤${prefix}cnpj — Dados de CNPJ
│🩷⃤${prefix}validarcpf — Validar CPF
│🧚‍♀️⃤${prefix}pokemon — Info de Pokémon
│🩷⃤${prefix}anime — Buscar anime
│🧚‍♀️⃤${prefix}filme — Buscar filme
╰━━━━━─「愛」─━━━━━
╭━━━⪩ *📞 CONTATO DO DONO* ⪨━━━
│🩷⃤Para adquirir Premium fale com:
│🧚‍♀️⃤+55 ${settings.numeroDono}
╰━━━━━─「愛」─━━━━━
🌸 _${settings.nomeDoBot} — use /menu para voltar_ 🌸`;
    await sock.sendMessage(from, { text: txt }, { quoted: msg });
  },
};
