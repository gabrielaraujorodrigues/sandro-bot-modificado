// Suprimir erros internos do libsignal (Bad MAC) — normais na 1ª reconexão
const _origConsoleError = console.error.bind(console);
console.error = (...args) => {
  const msg = args.join(' ');
  if (msg.includes('Bad MAC') || msg.includes('Failed to decrypt') || msg.includes('Session error') || msg.includes('Closing open session') || msg.includes('Closing session:') || msg.includes('_chains') || msg.includes('registrationId') || msg.includes('currentRatchet') || msg.includes('indexInfo') || msg.includes('pendingPreKey') || msg.includes('libsignal') || msg.includes('session_cipher') || msg.includes('SessionEntry')) return;
  _origConsoleError(...args);
};

const { startConnection } = require('./lib/connection');
const { carregarComandos, getComando } = require('./lib/commandHandler');
const { iniciarScheduler } = require('./lib/scheduler');
const { readJSON, writeJSON } = require('./lib/database');
const { downloadMediaMessage } = require('@whiskeysockets/baileys');
const pino = require('pino');
const settings = require('./settings.json');

const LINK_REGEX = /(chat\.whatsapp\.com\/|https?:\/\/)/i;
const PALAVROES = ['porra','caralho','buceta','viado','puta','merda','desgraça','cuzão','fdp','safado','vagabunda','prostituta','piranha','bosta','vadia','cu ','seu cu','teu cu','filha da puta'];

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

function getMsgType(msg) {
  const m = msg?.message;
  if (!m) return null;
  if (m.imageMessage) return 'image';
  if (m.videoMessage) return 'video';
  if (m.audioMessage || m.pttMessage) return 'audio';
  if (m.stickerMessage) return 'sticker';
  if (m.locationMessage) return 'location';
  if (m.contactMessage) return 'contact';
  if (m.documentMessage) return 'document';
  return 'text';
}

const PREFIXOS = ['/', '!', '.', '#'];
function getPrefix(texto) {
  for (const p of PREFIXOS) { if (texto.startsWith(p)) return p; }
  return null;
}

async function isAdmin(sock, groupId, userId) {
  try {
    const meta = await sock.groupMetadata(groupId);
    const p = meta.participants.find((x) => x.id === userId);
    return !!(p && (p.admin === 'admin' || p.admin === 'superadmin'));
  } catch { return false; }
}

function isOwner(userId) {
  return userId.split('@')[0].replace(/\D/g, '') === String(settings.numeroDono);
}

let nsfwModel = null;
async function checkNSFW(buffer) {
  try {
    if (!nsfwModel) {
      const tf = require('@tensorflow/tfjs-node');
      const nsfw = require('nsfwjs');
      nsfwModel = await nsfw.load();
    }
    const tf = require('@tensorflow/tfjs-node');
    const sharp = require('sharp');
    const jpegBuf = await sharp(buffer).jpeg().resize(224, 224).toBuffer();
    const tensor = tf.node.decodeImage(jpegBuf, 3);
    const predictions = await nsfwModel.classify(tensor);
    tensor.dispose();
    const porn = predictions.find(p => p.className === 'Porn')?.probability || 0;
    const hentai = predictions.find(p => p.className === 'Hentai')?.probability || 0;
    return { isNSFW: (porn + hentai) > 0.6 || porn > 0.5, porn, hentai };
  } catch {
    return { isNSFW: false, porn: 0 };
  }
}

async function handleMessage(sock, msg) {
  if (!msg.message) return;

  // Ignorar mensagens de status/broadcast
  const from = msg.key.remoteJid;
  if (!from || from === 'status@broadcast') return;

  const isGroup = from.endsWith('@g.us');

  // Sender: quando fromMe=true o remetente é o próprio dono
  // Em grupos: msg.key.participant ou o próprio número do bot
  let sender;
  if (msg.key.fromMe) {
    // Mensagem enviada pelo dono — pegar o número do bot conectado
    sender = sock.user?.id || `${settings.numeroDono}@s.whatsapp.net`;
    // Normalizar formato do número
    if (!sender.includes('@')) sender = `${sender}@s.whatsapp.net`;
  } else {
    sender = msg.key.participant || msg.key.remoteJid;
  }

  const tipo = getMsgType(msg);
  const texto = getTexto(msg);

  // ── ANTI-LINK ──
  if (isGroup && !msg.key.fromMe && texto && LINK_REGEX.test(texto)) {
    const cfg = readJSON('antilink', {});
    if (cfg[from]) {
      const souAdmin = isOwner(sender) || (await isAdmin(sock, from, sender));
      if (!souAdmin) {
        try {
          await sock.sendMessage(from, { delete: msg.key });
          await sock.sendMessage(from, { text: `🔗 *Antilink:* @${sender.split('@')[0]}, links não são permitidos!`, mentions: [sender] });
        } catch {}
        return;
      }
    }
  }

  // ── ANTI-PALAVRÃO ──
  if (isGroup && !msg.key.fromMe && texto) {
    const cfg = readJSON('antipalavrao', {});
    if (cfg[from]) {
      const souAdmin = isOwner(sender) || (await isAdmin(sock, from, sender));
      if (!souAdmin) {
        const lower = texto.toLowerCase();
        if (PALAVROES.some(p => lower.includes(p))) {
          try {
            await sock.sendMessage(from, { delete: msg.key });
            await sock.sendMessage(from, { text: `🤬 *Antipalavrão:* @${sender.split('@')[0]}, palavrões não são permitidos!`, mentions: [sender] });
          } catch {}
          return;
        }
      }
    }
  }

  // ── ANTI-MÍDIA ──
  if (isGroup && !msg.key.fromMe && tipo && tipo !== 'text') {
    const souAdmin = isOwner(sender) || (await isAdmin(sock, from, sender));
    if (!souAdmin) {
      const antimidiaMap = { image:'antiimg', video:'antivideo', audio:'antiaudio', sticker:'antisticker', location:'antiloc', contact:'anticontato', document:'antidoc' };
      const chave = antimidiaMap[tipo];
      if (chave) {
        const cfg = readJSON(chave, {});
        if (cfg[from]) {
          try { await sock.sendMessage(from, { delete: msg.key }); } catch {}
          return;
        }
      }

      if (tipo === 'sticker') {
        const cfg18 = readJSON('antifig18', {});
        if (cfg18[from]) {
          try {
            const buffer = await downloadMediaMessage(msg, 'buffer', {}, {
              logger: pino({ level: 'silent' }),
              reuploadRequest: sock.updateMediaMessage,
            });
            const { isNSFW } = await checkNSFW(buffer);
            if (isNSFW) {
              await sock.sendMessage(from, { delete: msg.key });
              await sock.groupParticipantsUpdate(from, [sender], 'remove');
              await sock.sendMessage(from, {
                text: `🚫 *Antifig18:* @${sender.split('@')[0]} foi banido por enviar conteúdo +18!`,
                mentions: [sender],
              });
            }
          } catch {}
        }
      }
    }
  }

  if (!texto) return;
  const prefix = getPrefix(texto);
  if (!prefix) return;

  const partes = texto.slice(prefix.length).trim().split(/\s+/);
  const cmdNome = (partes[0] || '').toLowerCase();
  const args = partes.slice(1);
  if (!cmdNome) return;

  const comando = getComando(cmdNome);
  if (!comando) {
    // Só responde "não encontrado" para mensagens de outros (não polui o próprio chat)
    if (!msg.key.fromMe) {
      await sock.sendMessage(from, { text: `❌ Comando *${prefix}${cmdNome}* não encontrado.\nDigite *${prefix}menu* para ver os comandos.` });
    }
    return;
  }

  const contexto = { from, sender, isGroup, prefix, args, texto, msg, settings };

  if (comando.groupOnly && !isGroup) { await sock.sendMessage(from, { text: '❌ Este comando só funciona em *grupos*!' }); return; }
  if (comando.ownerOnly && !isOwner(sender)) { await sock.sendMessage(from, { text: '❌ Este comando é exclusivo do *dono do bot*!' }); return; }
  if (comando.adminOnly) {
    const souAdmin = isOwner(sender) || (isGroup && (await isAdmin(sock, from, sender)));
    if (!souAdmin) { await sock.sendMessage(from, { text: '❌ Apenas *administradores* podem usar este comando!' }); return; }
  }

  try {
    await comando.execute(sock, contexto);
  } catch (e) {
    console.error(`[ERRO] ${cmdNome}:`, e.message);
    await sock.sendMessage(from, { text: `❌ Erro ao executar: ${e.message}` });
  }
}

async function main() {
  console.log('🤖 Iniciando Sandro Bot...');
  carregarComandos();
  const sock = await startConnection(handleMessage);
  sock.ev.on('connection.update', ({ connection }) => { if (connection === 'open') iniciarScheduler(sock); });
  sock.ev.on('group-participants.update', async ({ id, participants, action }) => {
    const config = readJSON('bemvindo', {});
    if (!config[id]) return;
    for (const p of participants) {
      try {
        if (action === 'add') {
          const txt = (settings.mensagemBoasVindas || '👋 Bem-vindo(a) @user!').replace('@user', `@${p.split('@')[0]}`);
          await sock.sendMessage(id, { text: txt, mentions: [p] });
        } else if (action === 'remove') {
          const txt = (settings.mensagemSaida || '👋 @user saiu.').replace('@user', `@${p.split('@')[0]}`);
          await sock.sendMessage(id, { text: txt, mentions: [p] });
        }
      } catch {}
    }
  });
}

main().catch((e) => { console.error('[ERRO FATAL]', e); process.exit(1); });
