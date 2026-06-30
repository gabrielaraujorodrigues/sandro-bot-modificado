module.exports = {
  name: 'menuutil', aliases: ['utilitarios', 'diversos', 'menudiversos', 'menubasico2'],
  description: 'Menu de utilitários e ferramentas',
  async execute(sock, { from, prefix, settings, msg }) {
    const txt =
`╔♡∞*♡♡∞:｡.｡🩷｡.｡:∞♡*♡:∞♡╗
╠═⪩⟨🩷𝐌𝐄𝐍𝐔-𝐔𝐓𝐈𝐋𝐈𝐃𝐀𝐃𝐄𝐒⟩
╚♡∞*♡♡∞:｡.｡🩷｡.｡:∞♡*♡:∞♡╝
╭━━━⪩ *🔧 FERRAMENTAS* ⪨━━━
│🩷⃤${prefix}ping — Velocidade do bot
│🧚‍♀️⃤${prefix}info — Sobre o bot
│🩷⃤${prefix}perfil — Ver seu perfil
│🧚‍♀️⃤${prefix}encurtar (link) — Encurtar URL
│🩷⃤${prefix}gerarsenha (tamanho) — Senha segura
│🧚‍♀️⃤${prefix}aleatorio (n) — Sorteio aleatório
│🩷⃤${prefix}feriados — Feriados nacionais
╰━━━━━─「愛」─━━━━━
╭━━━⪩ *🏦 FINANCEIRO* ⪨━━━
│🩷⃤${prefix}moeda — Dólar/Euro/Bitcoin
│🧚‍♀️⃤${prefix}cnpj (número) — Dados CNPJ
│🩷⃤${prefix}bancos — Lista de bancos
│🧚‍♀️⃤${prefix}validarcpf (cpf) — Validar CPF
╰━━━━━─「愛」─━━━━━
╭━━━⪩ *📍 GEOLOCALIZAÇÃO* ⪨━━━
│🩷⃤${prefix}cep (número) — Buscar endereço
│🧚‍♀️⃤${prefix}clima (cidade) — Previsão do tempo
╰━━━━━─「愛」─━━━━━
╭━━━⪩ *💬 COMUNICAÇÃO* ⪨━━━
│🩷⃤${prefix}traduzir (idioma) (texto)
│🧚‍♀️⃤${prefix}instastalk (usuario)
╰━━━━━─「愛」─━━━━━
🌸 _${settings.nomeDoBot} — use /menu para voltar_ 🌸`;
    await sock.sendMessage(from, { text: txt }, { quoted: msg });
  },
};
