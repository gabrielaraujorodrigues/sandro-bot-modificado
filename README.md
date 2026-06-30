# Sandro Bot — WhatsApp Bot

Bot de WhatsApp construído do zero com **@whiskeysockets/baileys**, com todos os comandos funcionando corretamente.

## Instalação

```bash
npm install
node index.js
```

## Configuração

Edite o arquivo `settings.json`:
```json
{
  "prefix": "/",
  "nomeDoBot": "Sandro Bot",
  "nickDono": "Sandro",
  "numeroDono": "558694029686",
  "mensagemBoasVindas": "👋 Bem-vindo(a) @user ao grupo!",
  "mensagemSaida": "👋 @user saiu do grupo."
}
```

## Primeiro login

**Com QR Code (padrão):**
```bash
node index.js
```
Escaneie o QR code no WhatsApp > Dispositivos vinculados.

**Com código de pareamento:**
```bash
USE_PAIRING_CODE=true node index.js
```

## Comandos

### 🌐 Geral
| Comando | Descrição |
|---------|-----------|
| /menu | Lista todos os comandos |
| /ping | Testa a velocidade do bot |
| /info | Informações sobre o bot |

### 🛡️ Administração (só admins)
| Comando | Descrição |
|---------|-----------|
| /abrir [hora] | Abre o grupo (ex: /abrir 22:00) |
| /fechar [hora] | Fecha o grupo (ex: /fechar 23:00) |
| /mute | Silencia o grupo |
| /desmute | Libera o grupo |
| /tagall [msg] | Marca todos os membros |
| /kick | Remove membro (responda ou mencione) |
| /add <número> | Adiciona membro |
| /promover | Promove a admin |
| /rebaixar | Remove admin |
| /linkgp | Link de convite do grupo |
| /antilink on/off | Ativa/desativa antilink |
| /bemvindo on/off | Ativa/desativa boas-vindas |
| /agendamentos | Lista agendamentos ativos |
| /cancelarag <id> | Cancela agendamento |

### 🎉 Diversão
| Comando | Descrição |
|---------|-----------|
| /sticker | Transforma imagem em figurinha |
| /toimg | Transforma figurinha em imagem |

### 👑 Dono
| Comando | Descrição |
|---------|-----------|
| /configurar | Configura o bot |

## Dependências

- `@whiskeysockets/baileys` — conexão com WhatsApp
- `sharp` — conversão de imagens para sticker WebP
- `moment-timezone` — agendamentos com horário de Brasília
- `fs-extra`, `pino`, `qrcode-terminal`, `node-fetch`
