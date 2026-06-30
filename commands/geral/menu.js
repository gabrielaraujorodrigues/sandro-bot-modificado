const { listarComandos } = require('../../lib/commandHandler');
const fs = require('fs');
const path = require('path');

module.exports = {
  name: 'menu',
  aliases: ['help', 'ajuda', 'comandos', 'cmd', 'inicio', 'início', 'start'],
  description: 'Mostra o menu completo de comandos',
  async execute(sock, { from, prefix, settings, msg, sender }) {
    const pushname = sender.split('@')[0];

    const txt =
`╔♡∞*♡♡∞:｡.｡🩷｡.｡:∞♡*♡:∞♡╗
╠═⪩⟨🧚‍♀️𝐒𝐄𝐉𝐀-𝐁𝐄𝐌-𝐕𝐈𝐍𝐃𝐎(𝐀)⟩
╚♡∞*♡♡∞:｡.｡🩷｡.｡:∞♡*♡:∞♡╝
╭━━⪩ 愛 INFO BOT | USER 愛 ⪨━━
│🧚‍♀️Bot: ${settings.nomeDoBot}
│🩷Dono: ${settings.nickDono}
│🧚‍♀️Usuário: *@${pushname}*
│🩷Biblioteca: Baileys
│🧚‍♀️Prefixo: [${prefix}]
╰━━━━━─「愛」─━━━━━
╭━━━⪩ *🌸 GERAL* ⪨━━━
│🩷${prefix}ping — Velocidade do bot
│🧚‍♀️${prefix}info — Sobre o bot
│🩷${prefix}perfil — Ver perfil
│🧚‍♀️${prefix}encurtar — Encurtar link
│🩷${prefix}cep — Buscar endereço
│🧚‍♀️${prefix}moeda — Cotação dólar/euro
│🩷${prefix}traduzir — Traduzir texto
╰━━━━━─「愛」─━━━━━
╭━━━⪩ *🎀 DIVERSÃO & APIS* ⪨━━━
│🩷${prefix}play — Baixar música YouTube
│🧚‍♀️${prefix}youtube — Buscar vídeos
│🩷${prefix}clima — Previsão do tempo
│🧚‍♀️${prefix}letra — Letra de música
│🩷${prefix}ia — Conversar com IA
│🧚‍♀️${prefix}waifu — Imagem de anime
│🩷${prefix}gato — Foto de gatinho
│🧚‍♀️${prefix}cachorro — Foto de cachorro
│🩷${prefix}piada — Piada aleatória
│🧚‍♀️${prefix}dado — Rolar um dado
│🩷${prefix}bola8 — Bola mágica
│🧚‍♀️${prefix}sticker — Criar figurinha
│🩷${prefix}toimg — Figurinha → imagem
╰━━━━━─「愛」─━━━━━
╭━━━⪩ *💬 TEXTOS* ⪨━━━
│🩷${prefix}cantada — Cantada aleatória
│🧚‍♀️${prefix}indireta — Indireta pesada
│🩷${prefix}motivacional — Frase motivacional
│🧚‍♀️${prefix}fraseamor — Frase de amor
│🩷${prefix}piada — Piada do dia
│🧚‍♀️${prefix}ship — Casal do grupo
│🩷${prefix}gerarsenha — Gerar senha segura
╰━━━━━─「愛」─━━━━━
╭━━━⪩ *🛡️ ADMIN (só admins)* ⪨━━━
│🩷${prefix}abrir — Abrir grupo
│🧚‍♀️${prefix}fechar — Fechar grupo
│🩷${prefix}mute — Silenciar grupo
│🧚‍♀️${prefix}desmute — Liberar grupo
│🩷${prefix}tagall — Marcar todos
│🧚‍♀️${prefix}kick — Remover membro
│🩷${prefix}add — Adicionar membro
│🧚‍♀️${prefix}promover — Promover admin
│🩷${prefix}rebaixar — Rebaixar admin
│🧚‍♀️${prefix}linkgp — Link do grupo
│🩷${prefix}antilink — Anti-link
│🧚‍♀️${prefix}bemvindo — Boas-vindas
│🩷${prefix}agendamentos — Ver agendamentos
│🧚‍♀️${prefix}cancelarag — Cancelar agendamento
╰━━━━━─「愛」─━━━━━
╭━━━⪩ *👑 DONO* ⪨━━━
│🩷${prefix}configurar — Configurar bot
╰━━━━━─「愛」─━━━━━
🌸 _${settings.nomeDoBot} — feito com amor_ 🌸`;

    const fotoPath = path.join(__dirname, '..', '..', 'assets', 'menu.jpg');
    if (fs.existsSync(fotoPath)) {
      const foto = fs.readFileSync(fotoPath);
      await sock.sendMessage(from, { image: foto, caption: txt }, { quoted: msg });
    } else {
      await sock.sendMessage(from, { text: txt }, { quoted: msg });
    }
  },
};
