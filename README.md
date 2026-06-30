# Sandro Bot — WhatsApp Bot v2

Bot de WhatsApp com **50+ comandos**, APIs reais, anti-nudez automático e agendamento de grupo.

## Instalação rápida

```bash
# Clone o repo
git clone https://github.com/gabrielaraujorodrigues/sandro-bot-modificado
cd sandro-bot-modificado

# Instale as dependências
npm install

# Configure settings.json com seu número
# Configure e inicie
node index.js
```

## Primeiro login

**Com QR Code:**
```bash
node index.js
# Escaneie o QR no WhatsApp > Dispositivos vinculados
```

**Com código de pareamento:**
```bash
npm run start:pairing
# Digite seu número e insira o código no WhatsApp
```

## Configurar settings.json

```json
{
  "prefix": "/",
  "nomeDoBot": "Sandro Bot",
  "nickDono": "Sandro",
  "numeroDono": "5511999999999",
  "mensagemBoasVindas": "👋 Bem-vindo(a) @user ao grupo!",
  "mensagemSaida": "👋 @user saiu do grupo."
}
```

## Comandos (50+)

### 🌐 Geral
`/menu` `/ping` `/info` `/perfil` `/encurtar` `/cep` `/moeda` `/traduzir` `/feriados` `/bancos`

### 🎀 Diversão & APIs
`/play` `/youtube` `/clima` `/letra` `/ia` `/waifu` `/gato` `/cachorro` `/piada` `/dado` `/bola8` `/pokemon` `/anime` `/filme` `/logo` `/sticker` `/toimg`

### 💬 Textos
`/cantada` `/indireta` `/motivacional` `/fraseamor` `/deboche` `/ansiedade` `/raiva` `/ship` `/gerarsenha`

### 🎮 Brincadeiras
`/cassino` `/ppt` `/vab` `/eununca` `/casal` `/chance` `/gay` `/feio` `/gostosa` `/tapa` `/beijo` `/matar`

### 🏆 Rankings
`/rankgay` `/rankcorno` `/rankzueiro` `/rankgostoso` `/rankgostosa` `/rankgado` `/rankotaku` `/ranklixo`

### 🛡️ Administração (só admins)
`/abrir [hora]` `/fechar [hora]` `/mute` `/desmute` `/tagall` `/kick` `/add` `/promover` `/rebaixar` `/linkgp`
`/antilink on|off` `/bemvindo on|off` `/agendamentos` `/cancelarag`
`/antiimg on|off` `/antivideo on|off` `/antiaudio on|off` `/antisticker on|off`
`/antifig18 on|off` `/antipalavrao on|off` `/antiloc on|off` `/antidoc on|off` `/anticontato on|off`
`/roletarussa` `/grupoinfo` `/descgp` `/nomegp` `/bancos`

### 👑 Dono
`/configurar` `/sairgp`

## Antifig18 — Auto-ban por nudez

Quando ativado com `/antifig18 on`, o bot usa IA (nsfwjs) para detectar figurinhas com nudez ou pornografia e bane automaticamente quem as enviar.

**Requer:** `npm install` instala automaticamente o nsfwjs + TensorFlow.js.

## Agendamento de grupos

```
/abrir 22:00  — Abre o grupo às 22h
/fechar 23:30 — Fecha o grupo às 23h30
/abrir 2h     — Abre em 2 horas
/fechar 30m   — Fecha em 30 minutos
/agendamentos — Lista agendamentos ativos
/cancelarag <id> — Cancela um agendamento
```
