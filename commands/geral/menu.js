const fs = require('fs');
const path = require('path');

module.exports = {
  name: 'menu',
  aliases: ['help', 'ajuda', 'comandos', 'cmd', 'inicio', 'start', 'inicio', 'inicio'],
  description: 'Mostra o menu completo de comandos',
  async execute(sock, { from, prefix, settings, msg, sender }) {
    const pushname = msg?.pushName || sender.split('@')[0];

    const txt =
`╔♡∞*♡♡∞:｡.｡🩷｡.｡:∞♡*♡:∞♡╗
╠═⪩⟨🧚‍♀️𝐒𝐄𝐉𝐀-𝐁𝐄𝐌-𝐕𝐈𝐍𝐃𝐎(𝐀)⟩
╚♡∞*♡♡∞:｡.｡🩷｡.｡:∞♡*♡:∞♡╝
╭━━⪩ 愛 INFO BOT | USER 愛 ⪨━━
│🧚‍♀️⃤Bot: ${settings.nomeDoBot}
│🩷⃤Dono: ${settings.nickDono}
│🧚‍♀️⃤Usuário: *${pushname}*
│🩷⃤Biblioteca: Baileys
│🧚‍♀️⃤Prefixo: [${prefix}]
│🩷⃤Versão: 2.0
╰━━━━━─「愛」─━━━━━
╭━━━⪩ *🌐 GERAL* ⪨━━━
│🩷⃤${prefix}ping — Velocidade do bot
│🧚‍♀️⃤${prefix}info — Sobre o bot
│🩷⃤${prefix}perfil — Ver seu perfil
│🧚‍♀️⃤${prefix}encurtar — Encurtar link
│🩷⃤${prefix}cep — Buscar endereço
│🧚‍♀️⃤${prefix}cnpj — Dados de empresa
│🩷⃤${prefix}moeda — Cotação dólar/euro
│🧚‍♀️⃤${prefix}traduzir — Traduzir texto
│🩷⃤${prefix}feriados — Feriados do Brasil
│🧚‍♀️⃤${prefix}bancos — Códigos dos bancos
│🩷⃤${prefix}validarcpf — Validar CPF
│🧚‍♀️⃤${prefix}aleatorio — Sorteio aleatório
╰━━━━━─「愛」─━━━━━
╭━━━⪩ *🎵 DOWNLOADS & BUSCA* ⪨━━━
│🩷⃤${prefix}play — Baixar música YouTube
│🧚‍♀️⃤${prefix}youtube — Buscar vídeos
│🩷⃤${prefix}clima — Previsão do tempo
│🧚‍♀️⃤${prefix}letra — Letra de música
│🩷⃤${prefix}ia — Conversar com IA
│🧚‍♀️⃤${prefix}filme — Info de filme
│🩷⃤${prefix}anime — Buscar anime
│🧚‍♀️⃤${prefix}pokemon — Info de Pokémon
╰━━━━━─「愛」─━━━━━
╭━━━⪩ *🐾 IMAGENS & FIGURINHAS* ⪨━━━
│🩷⃤${prefix}waifu — Imagem anime
│🧚‍♀️⃤${prefix}gato — Foto de gato
│🩷⃤${prefix}cachorro — Foto de cachorro
│🧚‍♀️⃤${prefix}meme — Meme aleatório
│🩷⃤${prefix}sticker — Criar figurinha
│🧚‍♀️⃤${prefix}toimg — Figurinha → imagem
│🩷⃤${prefix}logo — Gerar logo com texto
╰━━━━━─「愛」─━━━━━
╭━━━⪩ *💬 TEXTOS ALEATÓRIOS* ⪨━━━
│🩷⃤${prefix}cantada — Cantada do dia
│🧚‍♀️⃤${prefix}indireta — Indireta pesada
│🩷⃤${prefix}motivacional — Frase motivacional
│🧚‍♀️⃤${prefix}fraseamor — Frase de amor
│🩷⃤${prefix}deboche — Deboche do dia
│🧚‍♀️⃤${prefix}ansiedade — Frase de ansiedade
│🩷⃤${prefix}raiva — Frase de raiva
│🧚‍♀️⃤${prefix}piada — Piada aleatória
╰━━━━━─「愛」─━━━━━
╭━━━⪩ *🎮 JOGOS & BRINCADEIRAS* ⪨━━━
│🩷⃤${prefix}cassino — Caça-níqueis 🎰
│🧚‍♀️⃤${prefix}ppt — Pedra Papel Tesoura
│🩷⃤${prefix}dado — Rolar dado
│🧚‍♀️⃤${prefix}bola8 — Bola mágica
│🩷⃤${prefix}adivinha — Adivinhar número
│🧚‍♀️⃤${prefix}vab — Você prefere?
│🩷⃤${prefix}eununca — Eu nunca, eu já
│🧚‍♀️⃤${prefix}chance — Chance de algo
│🩷⃤${prefix}morte — Quando vai morrer 💀
│🧚‍♀️⃤${prefix}aleatorio — Sortear opções
╰━━━━━─「愛」─━━━━━
╭━━━⪩ *💕 BRINCADEIRAS (mencione)* ⪨━━━
│🩷⃤${prefix}ship — Compatibilidade casal
│🧚‍♀️⃤${prefix}casal — Casal do grupo
│🩷⃤${prefix}gay — % de gay 🌈
│🧚‍♀️⃤${prefix}feio — % de feiúra
│🩷⃤${prefix}gostosa — % de gostosura
│🧚‍♀️⃤${prefix}beijo — Mandar beijo
│🩷⃤${prefix}matar — Matar (brincadeira)
│🧚‍♀️⃤${prefix}tapa — Dar tapa
│🩷⃤${prefix}gerarsenha — Gerar senha
╰━━━━━─「愛」─━━━━━
╭━━━⪩ *🏆 RANKINGS* ⪨━━━
│🩷⃤${prefix}rankgay — Top 5 gays
│🧚‍♀️⃤${prefix}rankcorno — Top 5 cornos
│🩷⃤${prefix}rankzueiro — Top 5 zueiros
│🧚‍♀️⃤${prefix}rankgostoso — Top 5 gostosos
│🩷⃤${prefix}rankgostosa — Top 5 gostosas
│🧚‍♀️⃤${prefix}rankgado — Top 5 gados
│🩷⃤${prefix}rankotaku — Top 5 otakus
│🧚‍♀️⃤${prefix}ranklixo — Top 5 lixos
╰━━━━━─「愛」─━━━━━
╭━━━⪩ *🛡️ ADMIN DO GRUPO* ⪨━━━
│🩷⃤${prefix}abrir [hora] — Abrir grupo
│🧚‍♀️⃤${prefix}fechar [hora] — Fechar grupo
│🩷⃤${prefix}mute — Silenciar grupo
│🧚‍♀️⃤${prefix}desmute — Liberar grupo
│🩷⃤${prefix}tagall — Marcar todos
│🧚‍♀️⃤${prefix}kick — Remover membro
│🩷⃤${prefix}add — Adicionar membro
│🧚‍♀️⃤${prefix}promover — Promover admin
│🩷⃤${prefix}rebaixar — Rebaixar admin
│🧚‍♀️⃤${prefix}linkgp — Link do grupo
│🩷⃤${prefix}grupoinfo — Info do grupo
│🧚‍♀️⃤${prefix}descgp — Mudar descrição
│🩷⃤${prefix}nomegp — Mudar nome do gp
│🧚‍♀️⃤${prefix}agendamentos — Ver agendados
│🩷⃤${prefix}cancelarag — Cancelar ag.
│🧚‍♀️⃤${prefix}sairgp — Bot sai do grupo
│🩷⃤${prefix}roletarussa — Roleta russa
╰━━━━━─「愛」─━━━━━
╭━━━⪩ *🔞 ANTI-MÍDIA (admin)* ⪨━━━
│🩷⃤${prefix}antilink — Anti-link
│🧚‍♀️⃤${prefix}bemvindo — Boas-vindas
│🩷⃤${prefix}antifig18 — 🔞 Anti-nudez (bane)
│🧚‍♀️⃤${prefix}antiimg — Anti-imagens
│🩷⃤${prefix}antivideo — Anti-vídeos
│🧚‍♀️⃤${prefix}antiaudio — Anti-áudios
│🩷⃤${prefix}antisticker — Anti-figurinhas
│🧚‍♀️⃤${prefix}antipalavrao — Anti-palavrão
│🩷⃤${prefix}antiloc — Anti-localização
│🧚‍♀️⃤${prefix}antidoc — Anti-documentos
│🩷⃤${prefix}anticontato — Anti-contatos
╰━━━━━─「愛」─━━━━━
╭━━━⪩ *👑 DONO* ⪨━━━
│🩷⃤${prefix}configurar — Configurar bot
╰━━━━━─「愛」─━━━━━
🌸 _${settings.nomeDoBot} v2 — feito com amor_ 🌸`;

    const fotoPath = path.join(__dirname, '..', '..', 'assets', 'menu.jpg');
    if (fs.existsSync(fotoPath)) {
      const foto = fs.readFileSync(fotoPath);
      await sock.sendMessage(from, { image: foto, caption: txt }, { quoted: msg });
    } else {
      await sock.sendMessage(from, { text: txt }, { quoted: msg });
    }
  },
};
