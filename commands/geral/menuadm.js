module.exports = {
  name: 'menuadm', aliases: ['menua', 'menuadmin', 'adms', 'menuadms'],
  description: 'Menu de comandos de administração do grupo',
  async execute(sock, { from, prefix, settings, msg }) {
    const txt =
`╔♡∞*♡♡∞:｡.｡🩷｡.｡:∞♡*♡:∞♡╗
╠═⪩⟨🩷𝐂𝐎𝐌𝐀𝐍𝐃𝐎𝐒 𝐀𝐃𝐌⟩
╚♡∞*♡♡∞:｡.｡🩷｡.｡:∞♡*♡:∞♡╝
╭━━━⪩ *🛡️ GESTÃO DO GRUPO* ⪨━━━
│🩷⃤${prefix}abrir [HH:MM ou 2h/30m]
│🧚‍♀️⃤${prefix}fechar [HH:MM ou 2h/30m]
│🩷⃤${prefix}mute — Silenciar grupo
│🧚‍♀️⃤${prefix}desmute — Liberar grupo
│🩷⃤${prefix}grupoinfo — Infos do grupo
│🧚‍♀️⃤${prefix}descgp (texto) — Mudar descrição
│🩷⃤${prefix}nomegp (nome) — Renomear grupo
│🧚‍♀️⃤${prefix}linkgp — Gerar link do grupo
│🩷⃤${prefix}agendamentos — Listar agendamentos
│🧚‍♀️⃤${prefix}cancelarag (id) — Cancelar agendamento
╰━━━━━─「愛」─━━━━━
╭━━━⪩ *👥 MEMBROS* ⪨━━━
│🩷⃤${prefix}tagall — Marcar todos os membros
│🧚‍♀️⃤${prefix}kick [@] — Remover membro
│🩷⃤${prefix}add (número) — Adicionar membro
│🧚‍♀️⃤${prefix}ban (responder) — Banir usuário
│🩷⃤${prefix}promover [@] — Virar admin
│🧚‍♀️⃤${prefix}rebaixar [@] — Tirar admin
│🩷⃤${prefix}roletarussa — Roleta russa 🔫
│🧚‍♀️⃤${prefix}sairgp — Bot sai do grupo
╰━━━━━─「愛」─━━━━━
╭━━━⪩ *🔞 ANTI-MÍDIA* ⪨━━━
│🩷⃤${prefix}antifig18 on|off — 🔞 Anti-nudez (IA)
│🧚‍♀️⃤${prefix}antilink on|off — Anti-link
│🩷⃤${prefix}antiimg on|off — Anti-imagem
│🧚‍♀️⃤${prefix}antivideo on|off — Anti-vídeo
│🩷⃤${prefix}antiaudio on|off — Anti-áudio
│🧚‍♀️⃤${prefix}antisticker on|off — Anti-figurinha
│🩷⃤${prefix}antipalavrao on|off — Anti-palavrão
│🧚‍♀️⃤${prefix}antiloc on|off — Anti-localização
│🩷⃤${prefix}antidoc on|off — Anti-documento
│🧚‍♀️⃤${prefix}anticontato on|off — Anti-contato
╰━━━━━─「愛」─━━━━━
╭━━━⪩ *🎉 BOAS-VINDAS* ⪨━━━
│🩷⃤${prefix}bemvindo on|off — Boas-vindas
╰━━━━━─「愛」─━━━━━
🌸 _${settings.nomeDoBot} — use /menu para voltar_ 🌸`;
    await sock.sendMessage(from, { text: txt }, { quoted: msg });
  },
};
