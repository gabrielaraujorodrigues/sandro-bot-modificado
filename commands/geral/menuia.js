module.exports = {
  name: 'menuia', aliases: ['menuapis', 'apis'],
  description: 'Menu de comandos com APIs de inteligência e busca',
  async execute(sock, { from, prefix, settings, msg }) {
    const txt =
`╔♡∞*♡♡∞:｡.｡🩷｡.｡:∞♡*♡:∞♡╗
╠═⪩⟨🩷𝐌𝐄𝐍𝐔-𝐀𝐏𝐈𝐒⟩
╚♡∞*♡♡∞:｡.｡🩷｡.｡:∞♡*♡:∞♡╝
╭━━━⪩ *🤖 INTELIGÊNCIA* ⪨━━━
│🩷⃤${prefix}ia (mensagem) — Conversar com IA
│🧚‍♀️⃤${prefix}traduzir (idioma) (texto)
│🩷⃤  Ex: ${prefix}traduzir en Olá mundo
╰━━━━━─「愛」─━━━━━
╭━━━⪩ *🌤️ CLIMA & GEO* ⪨━━━
│🩷⃤${prefix}clima (cidade) — Previsão do tempo
│🧚‍♀️⃤${prefix}cep (cep) — Buscar endereço
│🩷⃤${prefix}feriados — Próximos feriados
╰━━━━━─「愛」─━━━━━
╭━━━⪩ *💰 FINANCEIRO* ⪨━━━
│🩷⃤${prefix}moeda — Cotação dólar/euro/bitcoin
│🧚‍♀️⃤${prefix}cnpj (número) — Dados de empresa
│🩷⃤${prefix}bancos — Códigos bancários
│🧚‍♀️⃤${prefix}validarcpf (cpf) — Validar CPF
╰━━━━━─「愛」─━━━━━
╭━━━⪩ *🎵 MÚSICA* ⪨━━━
│🩷⃤${prefix}play (música) — Baixar do YouTube
│🧚‍♀️⃤${prefix}youtube (busca) — Buscar vídeos
│🩷⃤${prefix}letra (música - artista)
╰━━━━━─「愛」─━━━━━
╭━━━⪩ *🔎 ENTRETENIMENTO* ⪨━━━
│🩷⃤${prefix}pokemon (nome) — Info de Pokémon
│🧚‍♀️⃤${prefix}anime (nome) — Info de anime
│🩷⃤${prefix}filme (nome) — Info de filme
│🧚‍♀️⃤${prefix}instastalk (user) — Instagram
╰━━━━━─「愛」─━━━━━
🌸 _${settings.nomeDoBot} — use /menu para voltar_ 🌸`;
    await sock.sendMessage(from, { text: txt }, { quoted: msg });
  },
};
