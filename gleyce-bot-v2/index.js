const { startConnection } = require('./lib/connection');
const { carregarComandos, getComando } = require('./lib/commandHandler');
const { iniciarScheduler } = require('./lib/scheduler');
const { readJSON } = require('./lib/database');
const settings = require('./settings.json');

const LINK_REGEX = /(chat\.whatsapp\.com\/|https?:\/\/)/i;

function getTexto(msg) {
  const m = msg?.message;
  if (!m) return '';
  return (
    m.conversation ||
    m.extendedTextMessage?.text ||
    m.imageMessage?.caption ||
    m.videoMessage?.caption ||
    m.buttonsResponseMessage?.selectedDisplayText ||
    ''
  );
}

const PREFIXOS = ['/', '!', '.', '#'];

function getPrefix(texto) {
  for (const p of PREFIXOS) {
    if (texto.startsWith(p)) return p;
  }
  return null;
}

async function isAdmin(sock, groupId, userId) {
  try {
    const meta = await sock.groupMetadata(groupId);
    const participante = meta.participants.find((p) => p.id === userId);
    return !!(participante && participante.admin);
  } catch (e) {
    return false;
  }
}

function isOwner(userId) {
  const numero = userId.split('@')[0].replace(/[^0-9]/g, '');
  return numero === settings.numeroDono;
}

async function handleMessage(sock, msg) {
  if (!msg.message || msg.key.fromMe) return;

  const from = msg.key.remoteJid;
  const isGroup = from.endsWith('@g.us');
  const sender = msg.key.participant || msg.key.remoteJid;

  const texto = getTexto(msg);
  if (!texto) return;

  // ── ANTILINK ──
  if (isGroup && LINK_REGEX.test(texto)) {
    const antilinkConfig = readJSON('antilink', {});
    if (antilinkConfig[from]) {
      const souAdmin = isOwner(sender) || (await isAdmin(sock, from, sender));
      if (!souAdmin) {
        try {
          await sock.sendMessage(from, { delete: msg.key });
          await sock.sendMessage(from, {
            text: `🔗 *Antilink:* @${sender.split('@')[0]}, links não são permitidos neste grupo!`,
            mentions: [sender],
          });
        } catch (e) {}
        return;
      }
    }
  }

  const prefix = getPrefix(texto);
  if (!prefix) return;

  const partes = texto.slice(prefix.length).trim().split(/\s+/);
  const cmdNome = (partes[0] || '').toLowerCase();
  const args = partes.slice(1);

  if (!cmdNome) return;

  const comando = getComando(cmdNome);
  if (!comando) {
    await sock.sendMessage(from, {
      text: `❌ O comando *${prefix}${cmdNome}* não existe.\n\nDigite *${prefix}menu* para ver todos os comandos disponíveis.`,
    });
    return;
  }

  const contexto = {
    from,
    sender,
    isGroup,
    prefix,
    args,
    texto,
    msg,
    settings,
  };

  if (comando.groupOnly && !isGroup) {
    await sock.sendMessage(from, { text: '❌ Este comando só funciona em *grupos*!' });
    return;
  }

  if (comando.ownerOnly && !isOwner(sender)) {
    await sock.sendMessage(from, { text: '❌ Este comando é exclusivo do *dono do bot*!' });
    return;
  }

  if (comando.adminOnly) {
    const souAdmin = isOwner(sender) || (isGroup && (await isAdmin(sock, from, sender)));
    if (!souAdmin) {
      await sock.sendMessage(from, { text: '❌ Apenas *administradores* podem usar este comando!' });
      return;
    }
  }

  try {
    await comando.execute(sock, contexto);
  } catch (e) {
    console.error(`[ERRO] Comando ${cmdNome}:`, e);
    await sock.sendMessage(from, { text: `❌ Ocorreu um erro ao executar o comando: ${e.message}` });
  }
}

async function main() {
  console.log('🩷 Iniciando Gleyce Bot Oficial...');
  carregarComandos();
  const sock = await startConnection(handleMessage);

  sock.ev.on('connection.update', ({ connection }) => {
    if (connection === 'open') {
      iniciarScheduler(sock);
    }
  });

  sock.ev.on('group-participants.update', async ({ id, participants, action }) => {
    const bemvindoConfig = readJSON('bemvindo', {});
    if (!bemvindoConfig[id]) return;

    for (const participante of participants) {
      try {
        if (action === 'add') {
          const texto = (settings.mensagemBoasVindas || '🩷 Bem-vindo(a) @user!').replace('@user', `@${participante.split('@')[0]}`);
          await sock.sendMessage(id, { text: texto, mentions: [participante] });
        } else if (action === 'remove') {
          const texto = (settings.mensagemSaida || '👋 @user saiu do grupo.').replace('@user', `@${participante.split('@')[0]}`);
          await sock.sendMessage(id, { text: texto, mentions: [participante] });
        }
      } catch (e) {}
    }
  });
}

main().catch((e) => {
  console.error('[ERRO FATAL]', e);
  process.exit(1);
});
